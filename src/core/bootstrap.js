import { name, version, homepage } from '../../package.json'
import Logger from 'js-logger'
import './polyfills.js'
import runtime from './runtime.js'

// Bootstrap logger
Logger.useDefaults()

// print header to console in browser environment
if (runtime.isBrowser) {
  console.log(
    homepage +
      ' ' +
      version +
      ' (@' +
      GIT_BRANCH +
      ' #' +
      GIT_COMMIT.substr(0, 7) +
      ' ' +
      BUILD_DATE +
      ')'
  )
}

// global dependencies

// three.js
// FIXME: use require alias after #126 is resolved
//if (runtime.isNode) global.THREE = runtime.require('three')
if (runtime.isNode) global.THREE = require('three')
