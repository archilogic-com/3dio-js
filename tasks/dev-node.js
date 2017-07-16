const gulp = require('gulp')
const build = require('./build')
const chalk = require('chalk')
const spawn = require('child_process').spawn

// tasks

const runNodeExample = gulp.series(
  build,
  runScriptFromCli
)

function runScriptFromCli () {
  return new Promise((resolve, reject) => {
    const ls = spawn('node', ['examples-node/main.js'])
    ls.stdout.on('data', (data) => {
      console.log(`out: ${data}`)
    })
    ls.stderr.on('data', (data) => {
      console.error(chalk.red(`err: ${data}`))
    })
    ls.on('close', (code) => {
      if (code === 0) {
        console.log(`example: done`)
        resolve()
      } else {
        throw new Error(`example: exited with code ${code}`.red)
        reject()
      }
    })
  })
}

// exports

module.exports = runNodeExample