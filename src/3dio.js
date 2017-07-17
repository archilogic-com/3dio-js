import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import configs from './core/configs.js'
import aFrame from './aframe.js'
import furniture from './furniture.js'
// import scene from './scene.js'
import storage from './storage.js'
import user from './user.js'

var IO3D = {

  // products
  aFrame: aFrame,
  furniture: furniture,
  storage: storage,

  // non-products
  user: user,

  // app specific
  runtime: runtime,
  configs: configs

}

export default IO3D