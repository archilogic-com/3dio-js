import './core/polyfills.js'
import './core/bootstrap.js'

import ThreeData3dView              from './core/three/data3d-view.js'
import decodeBuffer                 from './core/data3d/decode-buffer.js'
import loadData3d                   from './core/data3d/load.js'
import request                      from './core/io/request.js'
import fetch                        from './core/io/fetch.js'
import createFileDrop               from './core/ui/create-file-drop.js'
import uuid                         from './core/utils/uuid.js'
import url                          from './core/utils/url.js'
import path                         from './core/utils/path.js'
import callService                  from './core/services/call.js'
import getFromStore                 from './core/store/get.js'
import putToStore                   from './core/store/put.js'
import getProduct                   from './core/product/get.js'
import runtime                      from './core/runtime.js'

/**
 * @description base query library object
 * @namespace BASE
 * */

// TODO: methods: bake, furnish, analyze ??

var BASE = {

  // high-level / convenience

  /**
   * @namespace three
   * @memberof BASE
   */
  three: {
    Data3dView: ThreeData3dView
  },
  data3d: {
    load: loadData3d,
    decodeBuffer: decodeBuffer,
  },
  store: {
    get: getFromStore,
    put: putToStore
  },
  product: {
    get: getProduct
  },
  services: {
    call: callService
  },
  ui: {
    createFileDrop: createFileDrop
  },
  // scene: {},
  // space: {},
  // channel: { subscribe:… },
  // version: version,

  // low-level

  io: {
    fetch: fetch,
    request: request
  },
  utils: {
    uuid: uuid,
    path: path,
    url: url
  },
  runtime: runtime

}

export default BASE