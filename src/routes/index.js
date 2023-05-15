const { libraryRouter } = require('./library')

const { bookRouter }  = require('./book')

const { userRouter } = require('./user')

module.exports = { libraryRouter, bookRouter, userRouter }