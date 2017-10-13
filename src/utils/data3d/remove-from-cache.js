import runtime from '../../core/runtime.js'
import loadData3d from './load.js'
import getTextureUrls from './get-texture-urls'

export default function removeFromCache (url, cacheName) {
  if (!isCacheAvailable()) return Promise.reject()

  return caches.open(cacheName || '3dio-data3d').then(function onCacheReady(cache) {
    return loadData3d(url).then(function onData3dReady(data3d) {
      var cacheUrls = new Array(url).concat(getTextureUrls(data3d))
      return Promise.all(cacheUrls.map(function removeItem(url) { return cache.delete(url) }))
    })
  })
}

// helpers

function isCacheAvailable () {
  if (!runtime.isBrowser) {
    console.warn('The offline cache is only available in the browser')
    return false
  }

  if (typeof caches === 'undefined') {
    console.warn('Your browser does not support offline cache storage')
    return false
  }

  return true
}