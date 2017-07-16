import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
const execSync = require('child_process').execSync
const preamble = require('./preamble.js')

const gitBranchName = process.env.TRAVIS_BRANCH || execSync(`git rev-parse --abbrev-ref HEAD`).toString('utf8').replace('\n', '')
const gitCommitSha1 = execSync(`git rev-parse HEAD`).toString('utf8').replace('\n', '')

// Source: https://github.com/mrdoob/three.js/blob/86424d9b318f617254eb857b31be07502ea27ce9/rollup.config.js
function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl$/.test( id ) === false ) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
					.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
					.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			};

		}

	};

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
      banner: preamble,
      intro: `var GIT_BRANCH = '${gitBranchName}', GIT_COMMIT = '${gitCommitSha1}'`,
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
