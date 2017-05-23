import './bootstrap.js'

import { generateUuid, validateUuid } from './utils/uuid.js'
import runtime from './runtime.js'
import Entity from './base3d/entity.js'
import Storage from './base3d/storage.js'

/**
 * Creates an Base3d application instance.
 * @class Base3d
 * */
export default function Base3d () {
  // Avoid direct this references (= less bugs and ES2015 compatible)
  var app = this

  app.id = generateUuid()

  app.scene = new Entity(app)
  app.storage = new Storage(app)

  runtime.registerInstance(app)

  // Flags
  app.initialized = true

}

// Static flags
Base3d.initialized = false
Base3d.destroyed = null

/**
 * ...
 * @memberof Base3d
 * */
Base3d.prototype.destroy = function destroy () {
  var app = this

  runtime.deregisterInstance(app)
  app.destroyed = true
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