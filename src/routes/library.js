const express = require('express');
const libraryRouter = express.Router();

// siquelize models
const { Library } = require('../models') 

libraryRouter.get('/', (req, res) => {
    try{
        let findLibreries = Library.findAll()
        .then(libraries => {
            console.log(JSON.stringify(libraries, null, 2));
            res
            .status(200)
            .json(libraries)
            .end();
        })
    } catch(err){
        console.log(err);
        res
        .status(400)
        .json({err})
        .end()
    }
});

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

module.exports = { libraryRouter }