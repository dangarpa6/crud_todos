const { Sequelize } = require('sequelize');
require ('dotenv').config()

const sequelize = new Sequelize({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_NAME,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   dialect: "postgres",
   dialectOptions: {ssl: {require: true, rejectUnauthorized: false}},
})


module.exports = sequelize;

// postgres://todos_app_user:fvMHNATqLAmA3DDsQynrsagiv9YXVYuP@dpg-chgn9lbhp8u065oj394g-a.oregon-postgres.render.com/todos_app