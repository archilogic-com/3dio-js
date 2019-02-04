import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import configs from './core/configs.js'

import aframe from './aframe.js'
import furniture from './furniture.js'
import staging from './staging.js'
import storage from './storage.js'
import scene from './scene.js'
import floorPlan from './floor-plan.js'
import light from './light.js'
import modify from './modify.js'

import utils from './utils.js'

var io3d = {

  // APIs
  aFrame: aframe, // alias for legacy support
  aframe: aframe,
  furniture: furniture,
  staging:staging,
  storage: storage,
  scene: scene,
  floorPlan: floorPlan,
  light: light,
  modify: modify,

  // utils
  auth: utils.auth,
  ui: utils.ui,
  utils: utils,

  // core
  runtime: runtime,
  configs: configs,
  config: configs  // alias

}

// create globals for main lib object in browser environment
if (runtime.isBrowser) {
  window.io3d = io3d
  window.IO3D = io3d // upper case alias
}

export default io3d