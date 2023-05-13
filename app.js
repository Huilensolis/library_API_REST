const express = require('express');

const app = express();

const listeningPort = 7321;

// sequelize
const { db } = require('./src/db/index.js');


// routers:
const { libraryRouter } = require('./src/routes')
const { bookRouter } = require('./src/routes')
//middwares
const { consoleLoggingMIDWW } = require('./src/middlewares');

// models
const { Library } = require('./src/models/library.js');
const { Book } = require('./src/models')


//middw
// the order is important, all the middw must be before any other middw that tries to send a response to the client.
app.use(consoleLoggingMIDWW)
app.use(express.json());

// routes
app.use('/library', libraryRouter);
app.use('/book', bookRouter);

(async () => {

    // initializate the db
    await db.authenticate();
    console.log('Database connected succesfully');

    await Library.sync({ alter: true})
    console.log('Library table synchronized');

    await Book.sync({ alter: true })
    console.log('Book table synchronized');

    //listening
    app.listen(listeningPort, () => {
        console.log(`Server started on port ${listeningPort}`);
    })
})();

