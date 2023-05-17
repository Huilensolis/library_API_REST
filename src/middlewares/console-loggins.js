const consoleLoggingMIDWW = (req, res, next) => {
    console.log(`Req method: ${req.method}, req url: ${req.url}`);
    next();
}


module.exports = consoleLoggingMIDWW;