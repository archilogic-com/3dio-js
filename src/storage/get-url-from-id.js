import configs from '../core/configs.js'

// constants
var IS_URL = new RegExp('^http:\\/\\/.*$|^https:\\/\\/.*$')
var ID_TO_URL_CACHE = {}

// main
export default function getUrlFromStorageId (storageId, options) {

  // API
  options = options || {}
  var cdn = options.cdn !== undefined ? options.cdn : true
  var encode = options.encode !== undefined ? options.encode : true

  // check cache
  if (ID_TO_URL_CACHE[storageId + cdn + encode]) {
    return ID_TO_URL_CACHE[storageId + cdn + encode]
  }

  // check if storageId is URL already
  if (IS_URL.test(storageId)) {
    // add to cache
    ID_TO_URL_CACHE[ storageId + cdn + encode ] = storageId
    // return URL
    return storageId
  }

  // internals
  var processedStorageId = storageId

  // remove leading slash
  var startsWithSlash = /^\/(.*)$/.exec(processedStorageId)
  if (startsWithSlash) {
    processedStorageId = startsWithSlash[1]
  }

  // encode storageId if containig special chars
  if (encode && !/^[\.\-\_\/a-zA-Z0-9]+$/.test(processedStorageId)) {
    processedStorageId = encodeURIComponent(processedStorageId)
  }

  // compose url
  var url = 'https://' + (cdn ? configs.storageDomain : configs.storageDomainNoCdn) + '/' + processedStorageId

  // add to cache
  ID_TO_URL_CACHE[ storageId + cdn + encode ] = url
  
  return url
}