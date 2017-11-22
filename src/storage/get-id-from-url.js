import configs from '../core/configs.js'

// constants
var URL_TO_ID_CACHE = {}

// main
export default function getStorageIdFromUrl(url) {
  // check cache
  if (URL_TO_ID_CACHE[url]) return URL_TO_ID_CACHE[url]

  var isStorageRegexp = new RegExp(
    '^(http(s?))\\:\\/\\/(' +
    configs.storageDomain +
    '|' +
    configs.storageDomainNoCdn +
    ')'
  )

  // check if url is valid url
  if (isStorageRegexp.test(url)) {
    var storageId = url.replace(isStorageRegexp, '')
    // add to cache
    URL_TO_ID_CACHE[url] = storageId
    return storageId

  } else {
    console.error('Provided URL is not a valid URL:', url)
    return undefined
  }

}
