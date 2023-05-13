const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('../db/index');

const Book = db.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    isbn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
            len: [0, 18]
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // notEmplty only works for strings
            len: [1, 100]
        }
    },
    autor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0,
            max: new Date().getFullYear()
        }
    }, 
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        validate: {
            isBoolean: true,
        }
    }, 
})

(async () => {
    await Book.sync({ alter: true })
    console.log('Book table synchronized');
})();

module.exports = { Book };