const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres', 
});

module.exports = sequelize;