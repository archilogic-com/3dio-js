import configs from '../core/configs.js'

// constants
var URL_TO_ID_CACHE = {}
var IS_URL = new RegExp(
  '^(http(s?))\\:\\/\\/(' +
    configs.storageDomain +
    '|' +
    configs.storageDomainNoCdn +
    ')'
)

// main
export default function getStorageIdFromUrl(url) {
  // check cache
  if (URL_TO_ID_CACHE[url]) return URL_TO_ID_CACHE[url]

  // check if url is valid url
  if (IS_URL.test(url)) {
    var storageId = url.replace(IS_URL, '')
    // add to cache
    URL_TO_ID_CACHE[url] = storageId
    return storageId

  } else {
    console.error('Provided URL is not a valid URL:', url)
    return undefined
  }

}
