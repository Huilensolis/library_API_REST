const express = require('express')
const jwt = require('jsonwebtoken')

const logInRouter = express.Router()

const { secret } = require('../middlewares')

logInRouter.post('/', (req, res) => {
    const { username, password } = req.body
    if(!username || !password) {
        res.status(400).json({ message: 'Please provide username and password' })
    }
    // check if password is right and make an if else
    const token = jwt.sign({username, password}, secret)
    res.json({ token })
})

module.exports = { logInRouter }