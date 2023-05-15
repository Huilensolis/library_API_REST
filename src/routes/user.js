const express = require('express')

const { User } =  require('../models')

const userRouter = express.Router()

// GET
// all
userRouter.get('/', (req, res) => {
    
})
// by id(pk)
userRouter.get('/:id', (req, res) => {

})

// POST
userRouter.post('/', async (req, res) => {
    // userName, firstName, lastName, email, password
    const { username, firstName, lastName, email, password } = req.body
    try{
        if(!username || !firstName || !lastName || !email || !password){
            throw new Error('Missing required fields')
        }
        const params = { username, firstName, lastName, email, password }
        const newUser = User.build(params)
        console.log(newUser)
        await newUser.validate()

        res
        .status(201)
        .json(newUser)
        .end()
    } catch(err){
        console.log(err);

        res
        .status(500)
        .json(err)
        .end()
    }
})
module.exports = { userRouter }