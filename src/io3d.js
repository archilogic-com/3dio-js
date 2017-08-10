import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import configs from './core/configs.js'

import aFrame from './a-frame.js'
import furniture from './furniture.js'
import storage from './storage.js'
import utils from './utils.js'

var io3d = {

  // APIs
  aFrame: aFrame,
  furniture: furniture,
  storage: storage,

  // utils
  auth: utils.auth,
  ui: utils.ui,
  utils: utils,

  // core
  runtime: runtime,
  configs: configs,
  config: configs  // alias

}

// create upper case alias fro main lib object in browser environment
if (runtime.isBrowser) window.IO3D = io3d

export default io3d