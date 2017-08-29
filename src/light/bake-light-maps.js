import runtime from '../core/runtime.js'
import callServices from '../utils/services/call.js'

// main

export default function bakeLightMaps (input, options) {

  var storageId = input
  var assetStorageIds = []
  var sunDirection = [0.7487416646324341, -0.47789104947352223, -0.45935396425474223]
  var cacheKey = null // "preview9684e75cf46f2df04d497644589eda2f2ec754403c0c3912b5aa5914104ea3c1_bcf24e1dedf818e505b3321e0848ea02"

  console.log('Baking file: https://spaces.archilogic.com/3d/?mode=sdk&file='+storageId)

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

  // 279ecbf2-02eb-49b0-a7b8-ddcdafdfb4fb/processing/2017-08-28_23-26-59_5e7tlA/status.json

}