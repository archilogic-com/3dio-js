import fetch from '../io/fetch.js'
import decodeBinary from './decode-binary.js'
import PromiseCache from '../promise-cache.js'

// private shared

var cache = new PromiseCache()

// main

export default function loadData3d (url, options) {

  // prevent loading of unsupported formats
  if (url.indexOf('data3d.buffer') < 0) return Promise.reject(url + ' doesn\'t end with data3d.buffer')
  // try cache
  var cacheKey = url
  var promiseFromCache = cache.get(cacheKey)
  if (promiseFromCache) return promiseFromCache

  // fetch
  var promise = fetch(url, options).then(function(res){
    return res.arrayBuffer()
  }).then(function(buffer){
    return decodeBinary(buffer, { url: url })
  })

  // add to cache
  cache.add(cacheKey, promise)

  return promise

}
