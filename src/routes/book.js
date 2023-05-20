const express = require('express')

const bookRouter = express.Router()

const { Book, Library } = require('../models')

const passport = require('passport')
const auth = passport.authenticate('jwt', { session: false })
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
            if(book === null){
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
bookRouter.post('/', auth, async (req, res) => {
    let { isbn, title, author, year, LibraryId } = req.body;
    console.log(LibraryId);
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
            res.status(404).json(`the library with the id ${LibraryId} doesnt exist`).end() // changee
            return
        }
    }

    // we verify if we have recieved all params (library id can be null or undefined, its not obligatory)
    if(!isbn || !title || !author || !year){
        res
        .status(400)
        .json({error: `there are missing params in your request. `}, {params_expected: `isbn<strying>, title<string>, author<string>, year<int>`})
        .end()
        return;
    }
    // we check the data types
    if(typeof isbn !== 'number' || typeof title !== 'string' || typeof author !== 'string' || typeof year !== 'number'){
        console.log({idbn: typeof isbn, title: typeof title, author: typeof author, year: typeof year});
        res.status(400).json({params_expected: {isbn: "number", title: "string", author: "string", year: "number"}, params_received: {idbn: typeof isbn, title: typeof title, author: typeof author, year: typeof year}})
        return
    }


    try{
        const newBook = await Book.build({ isbn, title, author, year, LibraryId})

        try{
            await newBook.validate()    
        } catch(error){
            console.log(error);
            res.status(400).json({error: 'error while validating the data', error_data: error.errors}).end()
            return;
        }
        console.log(LibraryId);
        // if the json contains libraryId null
        if(LibraryId === null){
            // we save it
            try{
                await newBook.save()
            } catch(error){
                if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                    res.status(400).json(error)
                    return
                } else{
                    console.log(error);
                    res.status(500).json({error: 'internal server error'}).end()
                    return;
                }
            }

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
                
                try{
                    await newBook.save()
                } catch(error){
                    if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
                        res.status(400).json(error.errors).end()
                        return
                    } else {
                        console.log(error);
                        return
                    }
                }
                await newBook.setLibrary(library)
                const newBookFromDb = await Book.findByPk(newBook.id, {
                    include: [Library],
                });
    
                res.status(201).json(newBookFromDb).end()
                return
            } else{
                throw new Error({message: 'Library doesnt exist'}) // changee
            }
        }
    } catch (err){
        console.log(err);
        res
        .status(500) // changeee
        .json(err.errors.map(err => err.message))
        .end()
    }
})

// PUT
bookRouter.put('/:id', auth, async (req, res) => {
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
                .status(500)
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
bookRouter.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    
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
        await book.update({deletedAt: new Date(), isDeleted: true})
        .then( numberOfDestroyedRows => {
            if(numberOfDestroyedRows <= 0 ){
                res
                .status(500)
                .json('error updating')
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