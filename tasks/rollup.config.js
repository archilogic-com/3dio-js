import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
const preamble = require('./preamble.js')

// Source: https://github.com/mrdoob/three.js/blob/86424d9b318f617254eb857b31be07502ea27ce9/rollup.config.js
function glsl () {
  return {
    transform(code, id) {
      if (/\.glsl$/.test(id) === false) return
      var transformedCode = 'export default ' + JSON.stringify(
          code
            .replace(/[ \t]*\/\/.*\n/g, '') // remove //
            .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
            .replace(/\n{2,}/g, '\n') // # \n+ to \n
        ) + ';'
      return {
        code: transformedCode,
        map: {mappings: ''}
      }
    }
  }
}

// https://github.com/rollup/rollup/wiki/JavaScript-API#rolluprollup-options-
export default {
  entry: 'src/3dio.js',
  indent: '\t',
  sourceMap: true,
  plugins: [
    json(),
    glsl(),
    commonjs({
      // only modules used in browser need to be bundled.
      // modules only used in node envirenments will be loaded
      // during runtime using require
      include: [
        'node_modules/js-logger/**',
        'node_modules/bluebird/**'
      ]
    }),
    resolve()
  ],
  context: 'global', // required for whatwg-fetch module
  targets: [
    {
      format: 'umd',
      banner: preamble.text,
      intro: `var BUILD_DATE='${preamble.date}', GIT_BRANCH = '${preamble.gitBranchName}', GIT_COMMIT = '${preamble.gitCommitSha1}'`,
      moduleName: 'IO3D', // and global object name in browser environment
      globals: {
        THREE: 'THREE'
      },
      dest: 'build/3dio.js'
    }
  ],
  onwarn (warning) {
    // skip eval warnings (bluebird module uses eval)
    if (warning.code === 'EVAL') return
    // log everything else
    console.warn(warning.message)
  }
}
