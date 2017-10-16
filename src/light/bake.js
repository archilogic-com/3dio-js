import runtime from '../core/runtime.js'
import callServices from '../utils/services/call.js'
import whenDone from '../utils/processing/when-done.js'

// main
function bakeStage(stage) {
  function bake(storageId, options) {
    // API
    options = options || {}

    // Optional bake parameters for API call
    var bakeOptions = { sunDirection: options.sunDirection || [ 0.75, -0.48, -0.46 ] }
    if (options.lightmapCount) { bakeOptions.lightmapCount = options.lightmapCount }
    if (options.samples) { bakeOptions.samples = options.samples }

    // internals
    // TODO: reimplement send "exportable" textures to bake
    var assetStorageIds = []
    // TODO: reimplement caching mechanism on server side
    var cacheKey = null

    var bakeParams = {
      method: 'bake'.concat('.', stage),
      params: {
        inputFileKey: storageId,
        //inputAssetKeys: assetStorageIds,
        //cacheKey: cacheKey,
        options: JSON.stringify(bakeOptions)
      }
    }

    return callServices('Processing.task.enqueue', bakeParams)
  }
}

// expose API

export default {
  bake: bakeStage('preview'),
  bakePreview: bakeStage('preview'),
  bakeRegular: bakeStage('regular')
}
