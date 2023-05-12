const { Sequelize } = require('sequelize')


const db = new Sequelize({
    dialect: 'sqlite',
    storage: '../db',
})

module.exports = { db };