const express = require('express')

const bookRouter = express.Router()

const { Book } = require('../models')

// GET
bookRouter.get('/', async (req, res) => {
    Book.findAll()
    .then(books => {
        res
        .status(200)
        .json(books)
        .end()
    })
})
// by id
bookRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    Book.findByPk(id)
    .then(book => {
        if(book.length <= 0){
            res
            .status(404)
            .json('Book not found')
            .end()
        } 
        res
        .status(200)
        .json(book)
        .end()
    })
})

// POST
bookRouter.post('/', async (req, res) => {
    try{
        const { isbn, title, autor, year } = req.body
        const newBook = Book.build({ isbn, title, autor, year})
        newBook.save()

        res
        .status(201)
        .end()
    } catch (err){
        console.log(err.message);
        res
        .status(401)
        .json(err.message)
        .end()
    }
})

// PUT
bookRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { isbn, title, autor, year } = req.body;
    const params = { isbn, title, autor, year };

    if(params.length <= 0 || !id){
        res
        .status(400)
        .json('params expected')
        .end()
        return
    }

    Book.findByPk(id)
    .then(async book => {
        if(!book){
            res
            .status(404)
            .json('Book not found')
            .end()
            return;
        }
        try{
            await book.update(params)
            res
            .status(200)
            .json(book)
            .end()
        } catch (err){
            console.log(err.message);
            res
            .status(401)
            .json(err.message)
            .end()
        }
    })
})

// DELETE
bookRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if(!id){
        res
        .status(400)
        .json('params expected')
        .end()
        return;
    }
    
    // we look for the book to check if it exist
    await Book.findByPk(id)
    .then(async book => {
        if(!book){
            res
            .status(404)
            .json('Book not found')
            .end()
            return;
        }
        // then if it exist, we delete it.
        await book.update({
            isDeleted: true
        })
        .then( numberOfDestroyedRows => {
            if(numberOfDestroyedRows <= 0 ){
                res
                .status(404)
                .json('server error')
                .end()
                return;
            } 
            res
            .status(200)
            .json('Book deleted')
            .end()
        })
    })
})

module.exports = { bookRouter }