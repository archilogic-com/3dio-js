import core from './core.js'
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
  runtime: core.runtime,
  configs: core.configs

}

export default IO3D