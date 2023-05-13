const express = require('express');
const libraryRouter = express.Router();

// siquelize models
const { Library } = require('../models') 

// GET
// GET all
libraryRouter.get('/', (req, res) => {
    try{
        Library.findAll()
        .then(libraries => {
            if(libraries.length === 0){
                res
                .status(404)
                .json({err: `no libraries found, this could happend because all libraries have been deleted`})
                .end();
            } else{
                res
                .status(200)
                .json(libraries)
                .end();
            }
        })
    } catch(err){
        console.log(err);
        res
        .status(400)
        .json({err})
        .end()
    }
});

// GET by id
libraryRouter.get('/:id', (req, res) => {
    let id = req.params.id;
    try{

        Library.findByPk(id)
        .then(library => {
            if(library === null){
                res
                .status(404)
                .json({err: `library with id ${id} not found`})
                .end();
            } else{
                res
                .status(200)
                .json(library)
                .end()
            }
        })

    } catch(err){
        console.log(err);
        res
        .status(401)
        .json({err: `internal server error`})
        .end()
    }
})


// POST
// create new library
libraryRouter.post('/', async (req, res) => {
    const { name, location, landline } = req.body;
    const params = { name, location, landline };
    try{
        // we create a instance of the object and then save it in a var
        const newLibrary = Library.build(params);
        // (if you want to debugg, the lines down tells you if the instance of the model is being created.)
        // console.log(newLibrary instanceof Library); // true
        // console.log(newLibrary.name); // "Jane"

        await newLibrary.save();
        console.log(`the new library: ${newLibrary.name} has been created succesfully`);
        res.status(201).json({newLibrary}).end()
    } catch (err){
        res.status(400).json({err}).end()
    }
})

// PUT
// PUT by id(pk) // modify library
libraryRouter.put('/:id', async (req, res) => {
    let id = req.params.id;
    const { name, location, landline } = req.body;
    if(!name || !location || !landline){
        res
        .status(400)
        .json({err: 'missing parameters'})
        .end()

        return;
    }
    Library.findByPk(id)
    .then(async library => {

        if(!library){
            res
            .status(404)
            .json({err: `library with id ${id} not found`})
            .end();

            return;
        }
    
        try {
            await library.update({ name, location, landline })
        
            res
            .status(200)
            .end()
        } catch{
            res
            .status(400)
            .json({err: 'internal server error'})
            .end()
        }
    })
})

// DELETE
// DELETE ALL
libraryRouter.delete('/', async (req, res) => {
    try{
        // delte all table content:
        await Library.destroy({
            truncate: true,
        });

        res
        .status(200)
        .json({message: 'all librarys have been deleted'})
        .end()
    }catch{
        console.log('there was an error')
        res
        .status(400)
        .json({err: 'internal server error'})
        .end()
    }
})
module.exports = { libraryRouter };