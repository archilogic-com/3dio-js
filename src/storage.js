import put from './storage/put.js'
import get from './storage/get.js'
import getUrlFromStorageId from './storage/get-url-from-id.js'
import getNoCdnUrlFromStorageId from './storage/get-no-cdn-url-from-id.js'
import getStorageIdFromUrl from './storage/get-id-from-url.js'

var storage = {
  get: get,
  put: put,
  getUrlFromStorageId: getUrlFromStorageId,
  getNoCdnUrlFromStorageId: getNoCdnUrlFromStorageId,
  getStorageIdFromUrl: getStorageIdFromUrl
}

export default storage