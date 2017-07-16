import { name, version, homepage } from '../../package.json'
import Logger from 'js-logger'
import './polyfills.js'
import runtime from './runtime.js'

// Bootstrap logger
Logger.useDefaults()

// print header to console in browser environment

var isBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) === '[object Window]'
if (isBrowser) {
  console.log(name+' v'+version+'\n'+homepage+'\nbranch: '+GIT_BRANCH+'\ncommit: '+GIT_COMMIT)
}

// global dependencies

// three.js
if (runtime.isNode) {
  global.THREE = require('three')
} else if (typeof THREE === 'undefined') {
  throw new Error('Base query requires THREE.js library. Please add <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/85/three.min.js"></script> to your html file at top of <head> section.')
}