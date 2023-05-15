const express = require('express');

const app = express();

const listeningPort = 7321;

// sequelize
const { db } = require('./src/db');


// routers:
const { libraryRouter } = require('./src/routes')
const { bookRouter } = require('./src/routes')
const { userRouter } = require('./src/routes')
//middwares
const { consoleLoggingMIDWW } = require('./src/middlewares');
// here will be the auth

// models
const { Library } = require('./src/models/');
const { Book } = require('./src/models')
const { User } =  require('./src/models')

// services
const { errorHandling } = require('./src/services')

//middw
// the order is important, all the middw must be before any other middw that tries to send a response to the client.
app.use(consoleLoggingMIDWW)
app.use(express.json());

// routes
app.use('/library', libraryRouter);
app.use('/book', bookRouter);
app.use('/user', userRouter);

//initializateDB
async function initializateDB(){
    const DBErrorFilePath = './src/logs/dbErrorHandling.txt'
    // clearing all the logs
    errorHandling.clearLogs(DBErrorFilePath)

    try {
        // initializate the db from 0
        await db.sync();
        await db.authenticate()
        
        // snycing the Library & Book tables
        await Library.sync();
        console.log('Library table synchronized');
        
        await Book.sync();
        console.log('Book table synchronized');
        
        await User.sync();
        console.log('User table synchronized');
        
        Library.hasMany(Book);
    } catch(err) {
        errorHandling.log(err, DBErrorFilePath)
    }
}

//listening
app.listen(listeningPort, async () => {
    await initializateDB()
    console.log(`Server started on port ${listeningPort}`);
})

