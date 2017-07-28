import decodeBuffer                 from './utils/data3d/decode-buffer.js'
import loadData3d                   from './utils/data3d/load.js'
import request                      from './utils/io/request.js'
import fetch                        from './utils/io/fetch.js'
import getMimeTypeFromFilename      from './utils/get-mime-type-from-filename.js'
import uuid                         from './utils/uuid.js'
import getShortId                   from './utils/short-id.js'
import url                          from './utils/url.js'
import path                         from './utils/path.js'
import wait                         from './utils/wait.js'
import callService                  from './utils/services/call.js'

var utils = {

  data3d: {
    load: loadData3d,
    decodeBuffer: decodeBuffer
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
  getShortId: getShortId,
  path: path,
  wait: wait

}

export default utils