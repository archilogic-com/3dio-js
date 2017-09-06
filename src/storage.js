import put from './storage/put.js'
import get from './storage/get.js'
import getUrlFromStorageId from './storage/get-url-from-id.js'

var storage = {
  get: get,
  getUrlFromStorageId: getUrlFromStorageId,
  put: put
}

export default storage