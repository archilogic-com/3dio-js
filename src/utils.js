import decodeBuffer                 from './utils/data3d/decode-buffer.js'
import encodeBuffer                 from './utils/data3d/encode-buffer.js'
import loadData3d                   from './utils/data3d/load.js'
import traverseData3d               from './utils/data3d/traverse.js'
import cloneData3d                  from './utils/data3d/clone.js'
import ui                           from './utils/ui.js'
import auth                         from './utils/auth.js'
import request                      from './utils/io/request.js'
import fetch                        from './utils/io/fetch.js'
import getMimeTypeFromFilename      from './utils/file/get-mime-type-from-filename.js'
import gzip                         from './utils/file/gzip.js'
import uuid                         from './utils/uuid.js'
import getShortId                   from './utils/short-id.js'
import url                          from './utils/url.js'
import path                         from './utils/path.js'
import wait                         from './utils/wait.js'
import callService                  from './utils/services/call.js'

var utils = {

  data3d: {
    load: loadData3d,
    encodeBuffer: encodeBuffer,
    decodeBuffer: decodeBuffer,
    clone: cloneData3d,
    traverse: traverseData3d
  },
  ui: ui,
  auth: auth,
  io: {
    fetch: fetch,
    request: request
  },
  services: {
    call: callService
  },
  file: {
    getMimeTypeFromFilename: getMimeTypeFromFilename,
    gzip: gzip
  },
  url: url,
  uuid: uuid,
  getShortId: getShortId,
  path: path,
  wait: wait
  
}

export default utils