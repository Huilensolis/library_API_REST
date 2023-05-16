const fs = require('fs')

// Error handling.
const errorHandling = {
    // Error handling
    log: {
        dbErrors : (error) => {
            const filePath = 'src/logs/serverErrors.txt'
            error = `${error} \n`
            fs.appendFile(filePath, error, caseiFItFails => {
                if(caseiFItFails){
                    console.log('there is been an error and the error handling habe failed, the error will be logged in the console.');
                    console.log(caseiFItFails)
                } else{
                    console.log(`There is been an error, it has been logged into ${filePath}`);
                }
            })
        },
        // here we will create the other methods for other errors.
    },
    // clear logs
    clearLogs: (filePath) => {
        fs.truncate(filePath, 0, () => {
            console.log('Logs cleared');
        })
    }
}

module.exports = { errorHandling }