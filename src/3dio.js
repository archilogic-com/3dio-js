import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import configs from './core/configs.js'
import aFrame from './aframe.js'
import furniture from './furniture.js'
// import scene from './scene.js'
import utils from './utils.js'
import storage from './storage.js'
import auth from './auth.js'

var IO3D = {

  // products
  aFrame: aFrame,
  furniture: furniture,
  storage: storage,

  // non-products
  auth: auth,

  // app specific
  runtime: runtime,
  configs: configs,

  utils: utils

}

export default IO3D