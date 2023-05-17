const express = require('express')

const { User } =  require('../models')

const userRouter = express.Router()

// GET
// all
userRouter.get('/', async(req, res) => {
    // we find all users(this contains sensitive information(passwd))
    const allUsers = await User.findAll()
    // we filter them to return only the username, name and email
    const filteredUsers = allUsers.map(user => {
        return {
            username: user.username,
            name: user.name,
            email: user.email
        }
    })
    res.status(200).json(allUsers).end()
})
// by id(pk)
userRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    await User.findByPk(id)
    .then(user => {
        if(user === null){
            res.status(404).json({error: 'User not found'}).end()
            return;
        }

        console.log(user);
        // user = {
        //     id: user.id,
        //     username: user.username,
        //     name: user.name,
        //     email: user.email,
        //     createdAt: user.createdAt,
        //     updatedAt: user.updatedAt
        // }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user).end()
        return
    })

})

// POST
userRouter.post('/', async (req, res) => {
    // userName, firstName, lastName, email, password
    const { username, name: {firstName, lastName}, email, password } = req.body
    // console.log({params: { username, firstName, lastName, email, password }});
    try{
        // we verify if the obligatory params are being passed.
        if(!username || !email || !password){
            throw new Error('Missing required fields')
        }
        const newUser = User.build({ username, name: {firstName, lastName}, email, password })

        try {
            await newUser.validate()
        } catch (error) {
            console.log('validation failed');
            res
            .status(500)
            .json({error: error.message})
            .end()
            return;
        }

        try{
            await newUser.save()
        } catch(error){
            console.log(error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                res
                .status(400)
                .json({error: 'gamail already already exists'})
                .end()
                return;
            } else {
                res
                .status(500)
                .json(`Internal server error while saving user`)
                .end()
                return;
            }
        }

        res
        .status(201)
        .json({newUser:{username: newUser.username, name: newUser.name, email: newUser.email}})
        .end()
    } catch(err){
        console.log(err);
        res
        .status(500)
        .json(err)
        .end()
    }
})
module.exports = { userRouter }