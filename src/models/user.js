const { DataTypes } = require('sequelize');
const { db } = require('../db')

const { errorHandling } = require('../services')

const bcrypt = require('bcrypt');

const User = db.define('User', {
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 15],
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            len: [2, 15],
            is: ["[a-z]",'i'],
            isAlpha: true,
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        validate:{
            len: [2, 15],
            is: ["[a-z]",'i'],
            isAlpha: true,
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 20],
        }
    }
})

User.beforeCreate(async (user) => {
    const path = '../logs/dbErrorHandling.txt'
    bcrypt.hash(user.password, 10, (error, hash) => {
        if(error){
            errorHandling.log(error, path)
        }
        console.log(hash)
        user.password = hash;
    })
})
module.exports = { User }