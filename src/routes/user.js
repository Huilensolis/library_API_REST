const express = require('express')

const { User } =  require('../models')

const userRouter = express.Router()

const passport = require('passport')
const auth = passport.authenticate('jwt', { session: false })
// middeware

// GET
// all
userRouter.get('/', async(req, res) => {
    // we find all users(this contains sensitive information(passwd))
    const allUsers = await User.findAll({attributes: {exclude: ['password']}})
    // we filter them to return only the username, name and email
    const filteredUsers = allUsers.map(user => {
        delete user.password
        return user
    })
    res.status(200).json(filteredUsers).end()
})
// by id(pk)
userRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    await User.findByPk(id, {attributes: {exclude: ['password']}})
    .then(user => {
        if(user === null){
            res.status(404).json({error: 'User not found'}).end()
            return;
        }
        res.status(200).json(user).end()
        return
    })

})

// POST
userRouter.post('/', auth, async (req, res) => {
    // userName, name, email, password
    const { username, name, email, password } = req.body
    
    try{
        // we verify if the obligatory params are being passed.
        if(!username || !email || !password){
            throw new Error('Missing required fields')
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

        try {
            await newUser.save()
            const newUserFromDb = User.findByPk(newUser.id, {attributes: {exclude: ['password']}})

            res
            .status(201)
            .json(newUserFromDb)
            .end()
        } catch(error){
            console.log(error);

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
    } catch(err){
        console.log(err);
        res
        .status(500)
        .json(err)
        .end()
    }
})

// PUT
userRouter.put('/:id', auth, async (req, res) => {
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
userRouter.delete('/:id', auth, async (req, res) => {
    const { id } = req.params
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