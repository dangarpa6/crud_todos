const express = require('express');
const { Op } = require('sequelize');
const Todo = require('./models/Todo');
const sequelize = require('./utils/database');
const cors = require('cors')
require('dotenv').config();

const PORT = process.env.PORT || 4000;


sequelize.authenticate()
.then(()=> console.log("Base de datos conectada"))
.catch((err) => console.log(err));




sequelize.sync()
.then(() => {
    console.log("Base de datos sincronazada");
})
.catch((error) => console.log(error));

const app = express();

app.use(cors());

app.use(express.json());

// obtener todas las tareas

app.get('/api/v1/todos', async(req, res) => {
    try {
        const todos = await Todo.findAll();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
});

// obtener una tarea por su id 

app.get('/api/v1/todos/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const todos = await Todo.findByPk(id);
        if (!todos) {
            return res.status(404).json({error: 'Tarea no encontrada'});
        }
        res.json(todos);
    } catch (error) {
        res.status(500).json({error: 'Error al obtener la tarea'});
    }
});

// crear la tarea

app.post('/api/v1/todos', async (req, res) => {
    const { title, description } = req.body;


    try {
        const todo = await Todo.create({ title, description });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({error: 'Error al crear la tarea'});
    }
});

// actualizar la tarea

app.put('/api/v1/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const updatedTodo = await Todo.update(
            { title, description, completed },
            { where: { id }, returning: true } 
        );

        if (updatedTodo[0] === 0) {
            return res.status(404).json({error: "Tarea no encontrada"});
        }

        res.json(updatedTodo[1][0]);
    } catch (error) {
        res.status(500).json({error: "Error al actualizar la tarea"});
    }
}) 

// eliminar la tarea

app.delete('/api/v1/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await Todo.destroy({where: { id }});

        if (deletedTodo === 0) {
            return res.status(404).json({error: "Error, tarea no encontrada."})
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({error: "Error al eliminar la tarea"});
    }

});



app.listen(PORT, () => {
    console.log(`Servidor en escucha en el puerto ${PORT}`);
})