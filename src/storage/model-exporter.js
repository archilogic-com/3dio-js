import getConvertibleTextureIds from '../utils/processing/get-convertible-texture-ids.js'
import callServices from '../utils/services/call.js'

function getExporter(format) {
  return function exportModel(storageId, options) {

    // API
    options = options || {}

    return getConvertibleTextureIds(storageId).then(function(textureIds) {

      var convertParams = {
        method: 'convert'.concat('.', outputFormat),
        params: {
          inputFileKey: storageId,
          inputAssetKeys: textureIds
        }
      }

      // Optional convert parameters for API call
      if (options.filename) {
        convertParams.params.options = JSON.stringify( { outputFilename: options.filename } )
      }

      return callServices('Processing.task.enqueue', convertParams)

    })
  }
}

function exportDxf(storageId, options) {
    // API
    options = options || {}

    var dxfParams = {
      method: 'convert.dxf'
      params: {
        inputFileKey: storageId
      }
    }

    if (options.projection) {
      dxfParams.params.options = JSON.stringify( { projection: options.projection } )
    }

    return callServices('Processing.task.enqueue', dxfParams)
}


// expose API

export default {
  export3ds: getExporter('3ds'),
  exportBlend: getExporter('blend'),
  exportDae: getExporter('dae'),
  exportFbx: getExporter('fbx'),
  exportObj: getExporter('obj'),
  exportDxf
}
