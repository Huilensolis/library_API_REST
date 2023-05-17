const express = require('express');
const libraryRouter = express.Router();

// siquelize models
const { Library } = require('../models') 
const { Book } = require('../models');
// GET
// all
libraryRouter.get('/', async (req, res) => {
    try{
        await Library.findAll({
            include: Book
        })
        .then(libraries => {
            if(libraries.length === 0){
                res
                .status(404)
                .json({err: `no libraries found`})
                .end();
            } else{
                res
                .status(200)
                .json(libraries)
                .end();
            }
        })
    } catch(error){
        console.log(error);
        res.status(500).end()
    }
});

// by id
libraryRouter.get('/:id', async (req, res) => {
    let id = req.params.id;
    if(!id){
        res
        .status(400)
        .json({err: `id is required, your params: ${id}`})
        .end();
    }

    try{
        await Library.findByPk(id, {
            include: Book
        })
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

    } catch(error){
        console.log(error);
        res.status(500).end()
    }
})

// library books by id
libraryRouter.get('/:id/books', async (req, res) => {
    const { id } = req.params;
    if(!id){
        res
        .status(400)
        .json({err: `id is required, your params: ${id}`}).end()
    }

    try{
        await Library.findByPk(id, {
            include: Book
        })
        .then(library => {
            if(!library){
                console.log('library not found');
                res
                .status(404)
                .json({err: `library with id ${id} not found`})
                .end()
            } else {
                res
                .status(200)
                .json(library.Books)
                .end()
            }
        })
    } catch (error){
        console.log(error);
        res.status(500).end()
    }
})
// POST
// create new library
libraryRouter.post('/', async (req, res) => {
    const { name, location, landline } = req.body;
    const params = { name, location, landline };
    // we check if all params are sent
    if(!name || !location || !landline){
        res
        .status(400)
        .json({err: 'missing body parameters', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        .end()
        return;
    }
    // we check the body type of data
    if(typeof name !== 'string' || typeof location !== 'string' || typeof landline !== 'string'){
        res
        .status(400)
        .json({err: 'body parameters must be strings', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        .end()
        return;
    }

    try{
        // we create a instance of the object and then save it in a var
        const newLibrary = Library.build(params);
        // (if you want to debugg, the lines down tells you if the instance of the model is being created.)
        // console.log(newLibrary instanceof Library); 
        // console.log(newLibrary.name); // 

        // we validate it
        await newLibrary.validate();

        try{
            // we try to save it
            await newLibrary.save();
            res.status(201).json(newLibrary).end()
        } catch(error){
            // if it faisl, then we log it into the file, and send only the 'server error'
            console.log(error);
            res.status(500).json({err: 'internal server error'}).end()
        }
    } catch (error){
        console.log(error);
        res.status(400).json({err: 'validation error'}).end()
    }
})

// PUT
// by id(pk) // modify library
libraryRouter.put('/:id', async (req, res) => {
    let { id } = req.params;
    const { name, location, landline } = req.body;
    const params = { name, location, landline };

    // we check if all params are sent
    if(!id){
        res
        .status(400)
        .json({err: 'body parameters must be strings', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        .end()
        return;
    } 
    // mi idea es hacer algo como esto por cada parametro, pero no se ve nada practico ajajja
    if(name){
        if(typeof name !== 'string'){
            res
            .status(400)
            .json({err: 'body parameters must be strings', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        }
    }

    if(location){
        if(typeof location !== 'string'){
            res
            .status(400)
            .json({err: 'body parameters must be strings', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        }
    }

    if(landline){
        if(typeof landline !== 'string'){
            res
            .status(400)
            .json({err: 'body parameters must be strings', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        }
    }

    if(params.length <= 0){
        res
        .status(400)
        .json({err: 'missing body parameters', expectedBodyParams: {"name": "string", "location": "string", "landline": "string"}})
        .end()
        return;
    }
    // we end checking params
    /////////////////////////
    // we parse the id to int
    id = parseInt(id);

    await Library.findByPk(id)
    .then(async findLibrary => {
        if(!findLibrary){
            res
            .status(404)
            .json({err: `library with id ${id} not found`})
            .end();
            return;
        }
    
        try {
            await findLibrary.update({ name, location, landline })

            res.status(200).end()
        } catch{
            res.status(400).json({err: 'internal server error'}).end()
        }
    })
})

// DELETE
// DELETE ALL
libraryRouter.delete('/:id', async (req, res) => {
    let { id } = req.params;

    // we verify if we have the param id
    if(!id){
        res
        .status(400)
        .json({err: 'missing parameter {id}'})
        .end()
        return;
    }
    id = parseInt(id);

    // we verify if the library exist:
    const libraryExist = await Library.findByPk(id)
    .then(library => {
        if(!library){
            return false
        } else{
            return true
        }
    })
    if(!libraryExist){
        res
        .status(404)
        .json({err: `library with id ${id} not found`})
        .end();
        return;
    }

    // we delete a specific one
    try{
        await Library.destroy({
            where: {
                id: id,
            }
        }).then(destroyedRows => {
            if(destroyedRows === 0){
                console.log('database has faild to destroy the library');
                res.status(500).end()
            } else{
                res
                .status(200)
                .json({message: `the library with id ${id} has been deleted`})
                .end();
            }
        })
    } catch (err){
        console.log(error);
        res.status(500).end()
    }
})

module.exports = { libraryRouter };