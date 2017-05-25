import { version, homepage } from '../../package.json'
import Logger from 'js-logger'
import './polyfills.js'

// Bootstrap logger
Logger.useDefaults()

// print header to console
console.log('base3d.js v'+version+'\n'+homepage)