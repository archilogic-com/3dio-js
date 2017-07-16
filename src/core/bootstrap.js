import { name, version, homepage } from '../../package.json'
import Logger from 'js-logger'
import './polyfills.js'
import runtime from './runtime.js'

// Bootstrap logger
Logger.useDefaults()

// print header to console in browser environment
if (runtime.isBrowser) {
  console.log(homepage+' - v'+version+' - build: '+BUILD_DATE+' branch: '+GIT_BRANCH+' commit: '+GIT_COMMIT.substr(0,8) )
}

// global dependencies

// three.js
if (runtime.isNode) global.THREE = require('three')