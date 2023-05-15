const fs = require('fs')

// Error handling.
const errorHandling = {
    // Error handling
    log:(error, filePath) => {
        error = `${error} \n`
        fs.appendFile(filePath, error, caseErr => {
            if(caseErr){
                console.log('there is been an error and the error handling habe failed, we will log the error to the console.');
                console.log(caseErr)
            } else{
                console.log(`There is been an error, it has been logged into ${filePath}`);
            }
        })
    },
    // clear logs
    clearLogs: (filePath) => {
        fs.truncate(filePath, 0, () => {
            console.log('Logs cleared');
        })
    }
}

module.exports = { errorHandling }