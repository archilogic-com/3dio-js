import decodeBuffer                 from './core/data3d/decode-buffer.js'
import loadData3d                   from './core/data3d/load.js'
import request                      from './core/io/request.js'
import fetch                        from './core/io/fetch.js'
import getMimeTypeFromFilename      from './core/utils/get-mime-type-from-filename.js'
import uuid                         from './core/utils/uuid.js'
import url                          from './core/utils/url.js'
import path                         from './core/utils/path.js'
import wait                         from './core/utils/wait.js'
import callService                  from './core/services/call.js'

var utils = {

  data3d: {
    load: loadData3d,
    decodeBuffer: decodeBuffer,
  },
  io: {
    fetch: fetch,
    request: request
  },
  services: {
    call: callService
  },
  getMimeTypeFromFilename: getMimeTypeFromFilename,
  url: url,
  uuid: uuid,
  path: path,
  wait: wait

}

export default utils