import { version, homepage } from '../../package.json'
import Logger from 'js-logger'
import './polyfills.js'

// Bootstrap logger
Logger.useDefaults()

// print header to console in browser environment
var isBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) === '[object Window]'
if (isBrowser) {
  console.log('bq v'+version+'\n'+homepage)
}