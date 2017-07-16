const chalk = require('chalk')

function runTests (){
  throw new Error(chalk.red(`No tests specified`))
}

module.exports = runTests