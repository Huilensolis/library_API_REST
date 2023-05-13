const express = require('express')

const bookRouter = express.Router()

const { Book } = require('../models')

bookRouter.get('/', (req, res) => {
    
    res.end()
})

bookRouter.post('/', (req, res) => {
    try{
        const { isbn, title, autor, year } = req.body
        const newBook = Book.build({ isbn, title, autor, year})
        newBook.save()
    
        res
        .status(201)
        .json(newBook)
        .end()
    } catch (err){
        console.log(err.message);
        res
        .status(401)
        .json(err.message)
        .end()
    }
})

module.exports = { bookRouter }