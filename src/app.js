const express = require('express');
const { Op } = require('sequelize');
const Todo = require('./models/Todo');
const sequelize = require('./utils/database');
const cors = require('cors')
require('dotenv').config();

const PORT = process.env.PORT || 4000;


sequelize.authenticate()
.then(()=> console.log("Database conected"))
.catch((err) => console.log(err));




sequelize.sync()
.then(() => {
    console.log("Database synchronized");
})
.catch((error) => console.log(error));

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
res.send("server working")
});

// Get all the tasks

app.get('/api/v1/todos', async(req, res) => {
    try {
        const todos = await Todo.findAll();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error by getting the tasks' });
    }
});

// Get all the tasks by ID 

app.get('/api/v1/todos/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const todos = await Todo.findByPk(id);
        if (!todos) {
            return res.status(404).json({error: 'Tasks not found'});
        }
        res.json(todos);
    } catch (error) {
        res.status(500).json({error: 'Error getting the tasks'});
    }
});

// Create new tasks

app.post('/api/v1/todos', async (req, res) => {
    const { title, description } = req.body;


    try {
        const todo = await Todo.create({ title, description });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({error: 'Error creating tasks'});
    }
});

// Updated tasks

app.put('/api/v1/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const updatedTodo = await Todo.update(
            { title, description, completed },
            { where: { id }, returning: true } 
        );

        if (updatedTodo[0] === 0) {
            return res.status(404).json({error: "Tasks not found"});
        }

        res.json(updatedTodo[1][0]);
    } catch (error) {
        res.status(500).json({error: "Error updtating tasks"});
    }
}) 

// Delete tasks

app.delete('/api/v1/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTodo = await Todo.destroy({where: { id }});

        if (deletedTodo === 0) {
            return res.status(404).json({error: "Error task not found."})
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({error: "Error deleting tasks"});
    }

});



app.listen(PORT, () => {
    console.log(`Server listening port ${PORT}`);
})