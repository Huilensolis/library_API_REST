const express = require('express')

const bookRouter = express.Router()

const { Book, Library } = require('../models')
const { libraryRouter } = require('./library')

// GET
bookRouter.get('/', async (req, res) => {
    await Book.findAll()
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
    await Book.findByPk(id)
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
    const { isbn, title, author, year, LibraryId } = req.body
    const params = { isbn, title, author, year, LibraryId }
    if(!isbn || !title || !author || !year){
        res
        .status(400)
        .json(`params expected your params = ${JSON.stringify(params)}`)
        .end()
        return;
    }
    try{
        let libraryExist = await Library.findByPk(LibraryId)
        .then(library => {
            if(!library) {
                return false;
            } else{
                return true;
            }
        })
        if(libraryExist){
            const newBook = Book.build({ isbn, title, author, year, LibraryId})

            try{
                await newBook.validate()
            } catch (error){
                res
                .status(401)
                .json(error.errors.message)
                .end()
                return;
            }

            await newBook.save()
            
            const library = await Library.findByPk(LibraryId);
            await newBook.setLibrary(library)

            const newBookFromDb = await Book.findByPk(newBook.id, {
                include: [Library],
            });

            res
            .status(201)
            .json(newBookFromDb)
            .end()
            return
        } else {
            res
            .status(404)
            .json(`the library with the id ${LibraryId} doesnt exist`)
            .end()
        }
    } catch (err){
        res
        .status(401)
        .json(err.errors.map(err => err.message))
        .end()
    }
})

// PUT
bookRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { isbn, title, author, year } = req.body;
    const params = { isbn, title, author, year };

    if(params.length <= 0 || !id){
        res
        .status(400)
        .json(`params expected your params = ${JSON.stringify(params)}`)
        .end()
        return
    }

    await Book.findByPk(id)
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
            .status(201)
            .json(book)
            .end()
        } catch (err){
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
        .json(`id expected your param = ${id}`)
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
            .status(201)
            .json('Book deleted')
            .end()
        })
    })
})

module.exports = { bookRouter }