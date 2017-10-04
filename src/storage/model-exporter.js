import getConvertableTextureIds from '../utils/processing/get-convertable-texture-ids.js'
import callServices from '../utils/services/call.js'

function getExporter(format) {
  return function exportModel(storageId, options) {

    // API
    options = options || {}
    var filename = options.filename !== undefined ? options.filename : null

    return getConvertableTextureIds(storageId).then(function(textureIds) {

      var params = {
        method: 'convert',
        params: {
          inputFileKey: storageId,
          options: {
            inputAssetKeys: textureIds,
            outputFormat: format,
            outputFilename: filename
          }
        }
      }

      return callServices('Processing.task.enqueue', params)

    })
  }
}

// expose API

export default {
  export3ds: getExporter('3ds'),
  exportBlend: getExporter('blend'),
  exportDae: getExporter('dae'),
  exportFbx: getExporter('fbx'),
  exportObj: getExporter('obj')
}
