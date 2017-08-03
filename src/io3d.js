import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import configs from './core/configs.js'

import aFrame from './a-frame.js'
import furniture from './furniture.js'
import storage from './storage.js'
import auth from './auth.js'
import ui from './ui.js'
import utils from './utils.js'

var io3d = {

  // products
  aFrame: aFrame,
  furniture: furniture,
  storage: storage,

  // non-products
  auth: auth,
  ui: ui,
  utils: utils,

  // app specific
  runtime: runtime,
  configs: configs

}

// create upper case alias in browser environment
if (runtime.isBrowser) window.IO3D = io3d

export default io3d