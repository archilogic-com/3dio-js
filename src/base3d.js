import Logger from 'js-logger'
import './polyfills/polyfills.js'

import { generateUuid, validateUuid } from './utils/uuid.js'
import runtime from './runtime.js'
import initScene from './base3d/init-scene.js'
import initStorage from './base3d/init-storage.js'

// bootstrap
Logger.useDefaults()
var log = Logger

/**
 * Creates an Base3d application. The base3d() function is a top-level function exported by the base3d module.
 * @class Base3d
 * */
function Base3d (config) {

  var app = this

  // app.configs = initConfigs(app)
  app.scene = initScene(app)
  app.storage = initStorage(app)
  // app.io = initIo(app)
  app.id = generateUuid()

  runtime.registerInstance(app)

  // flags
  app.initialized = true

}
Base3d.initialized = false
Base3d.destroyed = null

/**
 * ...
 * @memberof Base3d
 * */
Base3d.prototype.destroy = function destroy () {
  runtime.deregisterInstance(app)
  this.destroyed = true
}

/**
 * ...
 * @memberof Base3d
 * @function
 * */
Base3d.registerPlugin = Base3d.prototype.registerPlugin = runtime.registerPlugin

/**
 * ...
 * @memberof Base3d
 * @namespace
 * */
Base3d.utils = Base3d.prototype.utils = {
  generateUuid: generateUuid,
  validateUuid: validateUuid
}


export default Base3d