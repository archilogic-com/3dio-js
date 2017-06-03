import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import decodeBuffer from './core/data3d/decode-buffer.js'
import View from './core/data3d/view.js'
import request from './core/io/request.js'
import uuid from './core/utils/uuid.js'
import loadData3d from './core/io/load-data3d.js'
import fetch from './core/io/fetch.js'
import getFromStore from './core/store/get.js'

/**
 * @description a-base library object
 * @namespace BASE
 * */

// TODO: methods?? bake,  furnish, analyze

var BASE = {

  //version: version

  // high-level / convenience

  three: {
    View: View
  },
  // ui: {}
  // poduct: {},
  // scene: {},
  // space: {}
  // channel: { subscribe:… }
  store: {
    get: getFromStore
  },

  // low-level

  // processing of data3d
  data3d: {
    decodeBuffer: decodeBuffer,
  },
  io: {
    // api: api,
    fetch: fetch,
    request: request,
    loadData3d: loadData3d
  },
  utils: {
    uuid: uuid,
  },
  runtime: runtime

}

export default BASE