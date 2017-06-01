import './core/polyfills.js'
import './core/bootstrap.js'

import runtime from './core/runtime.js'
import decodeBuffer from './core/data3d/decode-buffer.js'
import View from './core/data3d/view.js'
import request from './core/io/request.js'
import uuid from './core/utils/uuid.js'
import loadData3d from './core/io/load-data3d.js'
import fetch from './core/io/fetch.js'

/**
 * @description a-base library object
 * @namespace BASE
 * */
var BASE = {

  data3d: {
    decodeBuffer: decodeBuffer,
    View: View
  },

  utils: {
    uuid: uuid
  },

  io: {
    fetch: fetch,
    request: request,
    loadData3d: loadData3d
  },

  runtime: runtime

}

export default BASE