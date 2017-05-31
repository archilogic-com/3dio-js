import './core/polyfills.js'
import './core/bootstrap.js'

import decodeBuffer from './core/data3d/decode-buffer.js'
import View from './core/data3d/view.js'
import request from './core/io/request.js'
import uuid from './core/utils/uuid.js'

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
    request: request
  }

}

export default BASE