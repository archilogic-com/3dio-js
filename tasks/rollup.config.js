import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import less from 'rollup-plugin-less'
const preamble = require('./preamble.js')

// from https://github.com/mrdoob/three.js/blob/86424d9b318f617254eb857b31be07502ea27ce9/rollup.config.js
function glsl () {
  return {
    transform(code, id) {
      if (/\.glsl$/.test(id) === false) return
			// remove comments and fix new line chars
      code = code
        .replace(/[ \t]*\/\/.*\n/g, '') // remove //
        .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
        .replace(/\n{2,}/g, '\n') // # \n+ to \n
			// add module wrapper
			code = 'export default ' + JSON.stringify(code) + ';'
      return {
        code: code,
        map: {mappings: ''}
      }
    }
  }
}

// https://rollupjs.org/#javascript-api
export default {
  entry: 'src/io3d.js',
  indent: '\t',
  sourceMap: true,
  plugins: [
    json(),
    glsl(),
    less({
      include: [ '**/*.less', '**/*.css' ],
      insert: false, // true does insert css to head automatically
      output: function(css) { return css; } // avoids css file being created
    }),
    commonjs({
      // only modules used in browser need to be bundled.
      // modules only used in node envirenments will be loaded
      // during runtime using require
      include: [
        'node_modules/js-logger/**',
        'node_modules/bluebird/**',
        'node_modules/rxjs/**',
        'node_modules/lodash/**',
        'node_modules/performance-now/**'
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
      moduleName: 'io3d', // and global object name in browser environment
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
