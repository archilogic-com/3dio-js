import configs from '../core/configs.js'

// constants
var URL_TO_ID_CACHE = {}
var IS_HTTPS_URL = new RegExp('^https:\\/\\/storage\\.3d\\.io.*$')
var IS_HTTP_URL = new RegExp('^http:\\/\\/storage\\.3d\\.io.*$')

// main
export default function getStorageIdFromUrl (url) {

  // check cache
  if (URL_TO_ID_CACHE[url]) return URL_TO_ID_CACHE[url]

  var storageId = url

  if (IS_HTTPS_URL.test(url)) {
    storageId = url.substring(21)
  } else if (IS_HTTP_URL.test(url)) {
    storageId = url.substring(20)
  }

  // add to cache
  URL_TO_ID_CACHE[ url ] = storageId
  
  return storageId
}