const gulp = require('gulp')
const build = require('./build')
const chalk = require('chalk')
const spawn = require('child_process').spawn

// tasks

const runBrowserDevEnvironment = gulp.series(
  build,
  gulp.parallel(
    // watch source folder -> rebuild
    function watchSource () {
      gulp.watch('src/**/*.js', build)
    },
    // watch build folder -> update browser
    runLiteServer
  )
)

function runLiteServer () {
  return new Promise((resolve, reject) => {
    const ls = spawn('node_modules/.bin/lite-server', ['-c', 'tasks/lite-server.config.js'])
    ls.stdout.on('data', (data) => {
      console.log(`lite-server: ${data}`)
    })
    ls.stderr.on('data', (data) => {
      console.error(chalk.red(`lite-server: ${data}`))
    })
    ls.on('close', (code) => {
      if (code === 0) {
        console.log(`lite-server: closed`)
        resolve()
      } else {
        throw new Error(`lite-server: exited with code ${code}`)
        reject()
      }
    })
  })
}

// export

module.exports = runBrowserDevEnvironment