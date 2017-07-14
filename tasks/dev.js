const gulp = require('gulp')
const build = require('./build')
const spawn = require('child_process').spawn

/*
 * tasks
 */

var runDevEnvironment = gulp.series(
  build,
  gulp.parallel(
    // watch source folder -> rebuild
    () => {
      gulp.watch('src/**/*.js', build)
    },
    // watch build folder -> browser
    () => {
      return new Promise((resolve, reject) => {
        const ls = spawn('node_modules/.bin/lite-server', ['-c', 'tasks/lite-server.config.js'])
        ls.stdout.on('data', (data) => {
          console.log(`lite-server out: ${data}`)
        })
        ls.stderr.on('data', (data) => {
          console.log(`lite-server err: ${data}`)
        })
        ls.on('close', (code) => {
          if (code === 0) {
            console.log(`lite-server: DONE`)
            resolve()
          } else {
            console.error(`lite-server exited with code ${code}`)
            reject()
          }
        })
      })
    }
  )
)

var runNodeExample = gulp.series(
  build,
  () => {
    return new Promise((resolve, reject) => {
      const ls = spawn('node', ['examples/node/main.js'])
      ls.stdout.on('data', (data) => {
        console.log(`out: ${data}`)
      })
      ls.stderr.on('data', (data) => {
        console.log(`err: ${data}`)
      })
      ls.on('close', (code) => {
        if (code === 0) {
          console.log(`example: DONE`)
          resolve()
        } else {
          console.error(`example exited with code ${code}`)
          reject()
        }
      })
    })
  }
)

/*
 * export
 */

module.exports = {
  dev: runDevEnvironment,
  runNodeExample: runNodeExample
}