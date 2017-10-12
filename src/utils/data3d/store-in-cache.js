import runtime from '../../core/runtime.js'
import loadData3d from './load.js'

export default function storeInCache (url, cacheName) {
  if (!isCacheAvailable()) return Promise.reject()

  return caches.open(cacheName || '3dio-data3d').then(function onCacheReady(cache) {
    return loadData3d(url).then(function onData3dReady(data3d) {
      var cacheUrls = new Array(url).concat(parseMaterials(data3d))
      return cache.addAll(cacheUrls)
    })
  })
}

// helpers

function parseMaterials (data3d) {
  var materialUrls = []
  Object.keys(data3d.materials).forEach(function cacheMaterial(materialKey) {
    var material = data3d.materials[materialKey]
    if (material.mapDiffuse) materialUrls.push(material.mapDiffuse)
    if (material.mapDiffusePreview) materialUrls.push(material.mapDiffusePreview)

    if (material.mapNormal) materialUrls.push(material.mapNormal)
    if (material.mapNormalPreview) materialUrls.push(material.mapNormalPreview)

    if (material.mapSpecular) materialUrls.push(material.mapSpecular)
    if (material.mapSpecularPreview) materialUrls.push(material.mapSpecularPreview)

    if (material.mapAlpha) materialUrls.push(material.mapAlpha)
    if (material.mapAlphaPreview) materialUrls.push(material.mapAlphaPreview)

    if (material.mapLight) materialUrls.push(material.mapLight)
    if (material.mapLightPreview) materialUrls.push(material.mapLightPreview)
  })

  return materialUrls
}

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