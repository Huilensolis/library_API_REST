const { Sequelize } = require('sequelize')


const db = new Sequelize({
    dialect: 'sqlite',
    storage: '../newDb.sqlite',
})

module.exports = { db };