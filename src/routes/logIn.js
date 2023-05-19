const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const logInRouter = express.Router()

const {User} = require('../models')

const { secret } = require('../middlewares')

logInRouter.post('/', async (req, res) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(400).json({ message: 'Please provide username and password' })
    }
    if(username !== 'String' || password !== 'String') {
        res.status(400).json({ message: 'Please provide username and password as a string' })
    }
    
    const findUser = await User.findOne(
        {
            where: {
                username: username
            }
        }
    )
    if(!findUser){
        res.status(400).json({ message: 'User not found' })
        return;
    }
    const doesPasswordMatch = await bcrypt.compare(password, findUser.password)
    if(!doesPasswordMatch){
        res.status(400).json({ message: 'Password is not correct' }).end()
        return;
    }
    const token = jwt.sign({username, password}, secret)
    res.json({ token }).status(200).end()
})

module.exports = { logInRouter }