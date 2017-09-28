import runtime from '../core/runtime.js'
import callServices from '../utils/services/call.js'
import whenDone from '../utils/processing/when-done.js'

// main

function bake(storageId, options) {
  // API
  options = options || {}
  var sunDirection = sunDirection || [
    0.7487416646324341,
    -0.47789104947352223,
    -0.45935396425474223
  ]

  // internals
  var assetStorageIds = []
  // TODO: reimplement caching mechanism on server side
  var cacheKey = null

  return callServices('Processing.task.enqueue', {
    method: 'bakePreview',
    params: {
      inputFileKey: storageId,
      options: {
        inputAssetKeys: assetStorageIds,
        sunDirection: sunDirection,
        cacheKey: cacheKey
      }
    }
  })
}

// public methods

bake.whenDone = whenDone

// expose API

export default bake
