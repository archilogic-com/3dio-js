import fetch from '../io/fetch.js'
import decodeBinary from './decode-binary.js'
import PromiseCache from '../promise-cache.js'

// private shared

var cache = new PromiseCache()

// main

export default function loadData3d (url, options) {

  // "prevent" loading of unsupported formats
  if (url.match(/data3d\.buffer$/)) {
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
  } else if (url.match(/data3d\.json$/)) {
    // try cache
    var cacheKey = url
    var promiseFromCache = cache.get(cacheKey)
    if (promiseFromCache) return promiseFromCache

    // fetch
    var promise = fetch(url, options).then(function(res){
      return res
    })

    // add to cache
    cache.add(cacheKey, promise)

    return promise
  } else {
    return Promise.reject('\''+url+'\' does not end with data3d.buffer or data3d.json')
  }

}
