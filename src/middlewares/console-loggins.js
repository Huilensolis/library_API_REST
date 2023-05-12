const consoleLoggingMIDWW = (req, res, next) => {
    console.log(`Req method: ${req.method}, req url: ${req.url}`);
    res.setHeader('Content-Type', 'application/json');
    next();
}


module.exports = consoleLoggingMIDWW;