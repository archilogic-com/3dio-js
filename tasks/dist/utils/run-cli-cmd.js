const Promise = require('bluebird')
const spawn = require('child_process').spawn

module.exports = function run (a, b) {

  if (typeof a === 'string') {
    var lines = a.split('\n')
    if (lines.length === 1) {
      // is single command
      return runSingleCmd(a, b)
    } else {
      // is multiple commands
      a = lines
    }
  }

  if (Array.isArray(a)) {
    // run multiple commands
    return Promise.mapSeries(a, (args) => {
      if (Array.isArray(args)) {
        return runSingleCmd(args[0], args[1])
      } else if (typeof args === 'function') {
        return args()
      } else {
        console.log(args)
        return runSingleCmd(args)
      }
    })
  }

}

function runSingleCmd (cmd, args) {
  return new Promise((resolve, reject) => {

    let ls, parts

    if (args) {
      ls = spawn(cmd, args)
    } else {
      parts = cmd.split(' ')
      ls = spawn(parts[0], parts.slice(1))
    }

    ls.stdout.on('data', (data) => {
      console.log(`${data}`)
    })

    ls.stderr.on('data', (data) => {
      console.error(`${data}`)
    })

    ls.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    })

  })
}