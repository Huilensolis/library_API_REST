const express = require('express')

const bookRouter = express.Router()

const { Book, Library } = require('../models')
// GET
bookRouter.get('/', async (req, res) => {
    try{
        await Book.findAll()
        .then(books => {
            res
            .status(200)
            .json(books)
            .end()
        })
    } catch (error){
        console.log(error);
        res.status(500).end();
    }
})
// by id
bookRouter.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        await Book.findByPk(id)
        .then(book => {
            if(book.length <= 0){
                res
                .status(404)
                .json('Book not found')
                .end()
            } 
            res.status(200).json(book).end()
        })
    } catch(error){
        console.log(error);
        res.status(500).end()
    }
})

// POST
bookRouter.post('/', async (req, res) => {
    const { isbn, title, author, year } = req.body;
    let { LibraryId } = req.body
    // if they dont send a library id, it is set to null
    if(LibraryId === undefined){
        LibraryId = null;
    } else{
        let libraryExist = await Library.findByPk(LibraryId)
        .then(library => {
            if(!library) {
                return false;
            } else{
                return true;
            }
        })
        if(!libraryExist){
            res.status(404).json(`the library with the id ${LibraryId} doesnt exist`).end()
            return
        }
    }

    // we verify if we have recieved all params (library id can be null or undefined, its not obligatory)
    if(!isbn || !title || !author || !year){
        res
        .status(400)
        .json(`params expected: isbn<strying>, title<string>, author<string>, year<int>`)
        .end()
        return;
    }
    // we check the data types
    if(typeof isbn !== 'number' || typeof title !== 'string' || typeof author !== 'string' || typeof year !== 'number'){
        console.log({idbn: typeof isbn, title: typeof title, author: typeof author, year: typeof year});
        res.status(401).json({params_expected: {isbn: "number", title: "string", author: "string", year: "number"}, params_received: {idbn: typeof isbn, title: typeof title, author: typeof author, year: typeof year}})
        return
    }


    try{
        const newBook = await Book.build({ isbn, title, author, year, LibraryId})

        await newBook.validate()    

        // if the json contains libraryId null
        if(LibraryId === null){
            // we save it
            await newBook.save()
            const newBookFromDb = await Book.findByPk(newBook.id)
            // const newBookFromDb = await Book.findOne({where: {
            //     isbn: isbn
            // }
            // })
            console.log(newBookFromDb);
            res.status(201).json(newBookFromDb).end()
            return;
        } else {
            // we check if it exist
            let libraryExist = await Library.findByPk(LibraryId)
            .then(library => {
                if(!library) {
                    return false;
                } else{
                    return true;
                }
            })

            if(libraryExist){
                const library = await Library.findByPk(LibraryId);
                await newBook.setLibrary(library)
                await newBook.save()
                const newBookFromDb = await Book.findByPk(newBook.id, {
                    include: [Library],
                });
    
                res.status(201).json(newBookFromDb).end()
                return
            }
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
    try{
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
    } catch (error){
        console.log(error);
        res.status(500).end()
    }
})

// DELETE
bookRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if(!id){
        res
        .status(400)
        .json(`id expected. your param = ${id}`)
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
            } else{
                res
                .status(201)
                .json('Book deleted')
                .end()
            }
        })
    })
})

module.exports = { bookRouter }