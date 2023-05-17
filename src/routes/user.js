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
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    })
    res.status(200).json(filteredUsers).end()
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
        user = {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            isDeleted: user.isDeleted,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        res.status(200).json(user).end()
        return
    })

})

// POST
userRouter.post('/', async (req, res) => {
    // userName, name, email, password
    const { username, name, email, password } = req.body
    
    try{
        // we verify if the obligatory params are being passed.
        if(!username || !email || !password){
            throw new Error('Missing required fields')
        }
        if(password.length > 20 || password.length < 10){
            throw new Error('Password must be between 10 and 20 characters')
        }
        const newUser = User.build({ username, name, email, password })

        try {
            await newUser.validate()
        } catch (error) {
            console.log('validation failed');
            res
            .status(500)
            .json({error: error})
            .end()
            return;
        }

        try{
            await newUser.save()
        } catch(error){
            console.log({error});

            if (error.name === 'SequelizeUniqueConstraintError') {
                res
                .status(400)
                .json({error: 'the gmail must be unique and the name must be alpha'})
                .end()
                return;
            } else{
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

// PUT
userRouter.put('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { username, name, email, password, isDeleted } = req.body;
        let bodyParams = { username, name, email, password, isDeleted };

        let ifNoParams = Object.values(bodyParams).every(param => param === undefined)
        if(ifNoParams || !id){
            res
            .status(400)
            .json(`there is been an error receiving the params. the params expected are some of these: id, username, name, email, password, isDeleted.`)
            .end()
            return
        }
        const thisUser =  await User.findByPk(id)
        if(thisUser === null){
            res
            .status(404)
            .json(`User not found`)
            .end()
            return
        }
        await thisUser.update(bodyParams, {
            where:{
            id: id
            }
        })
        .then(rowsUpdated => {
            if(rowsUpdated <= 0){
                res
                .status(500)
                .json(`error updating`)
                .end()
                return
            } else{
                res
                .status(201)
                .json(`User updated`)
                .end()
                return;
            }
        })
    } catch(error){
        console.log(error);
        res
        .status(500)
        .json(error.message)
        .end()
    }
})

// DELETE
userRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    if(!id){
        res.status(400).json({error: 'Missing id in req params'}).end()
        return
    }

    await User.findByPk(id)
    .then(user => {
        if(user === null){
            res.status(404).json({error: 'User not found'}).end()
            return;
        }
    })

    try{
        await User.update({deletedAt: new Date(), isDeleted: true}, {where: {id : id}})
        .then(rowsDeleted => {
            if(rowsDeleted <= 0){
                res.status(500).json({error: 'internal server error'}).end()
                return;
            } else{
                res.status(201).json({message: 'User deleted'}).end()
            }
        })
    } catch(error){
        console.log(error);
        res.status(500).json({error: 'internal server error'}).end();
    }

})
module.exports = { userRouter }