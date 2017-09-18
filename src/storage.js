import put from './storage/put.js'
import get from './storage/get.js'
import getUrlFromStorageId from './storage/get-url-from-id.js'
import getStorageIdFromUrl from './storage/get-id-from-url.js'

var storage = {
  get: get,
  put: put,
  getUrlFromStorageId: getUrlFromStorageId,
  getStorageIdFromUrl: getStorageIdFromUrl
}

export default storage