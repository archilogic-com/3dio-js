const Promise = require('bluebird')
const spawn = require('child_process').spawn
const version = require('../package.json').version

run([
  // empty build fodler
  'rm -f build/*',
  // bundle with rollup
  'node_modules/rollup/bin/rollup -c',
  // empty distribution folder
  'rm -f dist/*',
  // copy build files to distribution folder
  `cp -R build/ dist/`,
  // uglify
  'node_modules/uglify-js/bin/uglifyjs dist/base-query.js -o dist/base-query.min.js -cm --source-map includeSources,content=build/base-query.js.map,url=base-query.min.js.map',
  // gzip uglified files
  `gzip -9 dist/base-query.min.js dist/base-query.min.js.map`,
  // remove .gz extension and add version to name
  `mv dist/base-query.min.js.gz dist/base-query-${version}.min.js`,
  `mv dist/base-query.min.js.map.gz dist/base-query-${version}.min.js.map`,
  // add version to name of non-uglified files
  `mv dist/base-query.js dist/base-query-${version}.js`,
  `mv dist/base-query.js.map dist/base-query-${version}.js.map`
]).catch((err) => {
  console.error(err)
})

/////////////////////////////////// helpers

function run (a, b) {

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

