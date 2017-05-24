import fs from 'fs'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

var packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf8'))

export default {
  entry: 'src/base3d.js',
  indent: '\t',
  sourceMap: true,
  plugins: [
    json(),
    commonjs({
      exclude: [ 'node_modules/node-fetch/**' ]
    }),
    resolve()
  ],
  context: 'global', // required for whatwg-fetch module
  targets: [
    {
      format: 'umd',
      banner: '/* base3d.js lib v' + packageInfo.version + ' ' + packageInfo.repository.url + '*/',
      moduleName: 'base3d',
      dest: 'build/base3d.js'
    }
  ],
  onwarn (warning) {
    // skip eval warnings (bluebird module uses eval)
    if (warning.code === 'EVAL') return
    // log everything else
    console.warn(warning.message)
  }
}
