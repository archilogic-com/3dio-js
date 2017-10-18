import getConvertibleTextureIds from '../utils/processing/get-convertible-texture-ids.js'
import callServices from '../utils/services/call.js'

function getExporter(format) {
  return function exportModel(storageId, options) {

    // API
    options = options || {}

    return getConvertibleTextureIds(storageId).then(function(textureIds) {

      var convertParams = {
        method: 'convert'.concat('.', format),
        params: {
          inputFileKey: storageId,
          inputAssetKeys: textureIds
        }
      }

      // Optional convert parameters for API call
      if (options.filename) {
        convertParams.params.settings = JSON.stringify( { outputFileName: options.filename } )
      }

      return callServices('Processing.task.enqueue', convertParams)

    })
  }
}

function exportDxf(storageId, options) {
    // API
    options = options || {}

    var dxfParams = {
      method: 'convert.dxf',
      params: {
        inputFileKey: storageId
      }
    }

    // Optional convert parameters for API call
    if (options.filename || options.projection) {
      var dxfSettings = {}
        if (options.filename) {
         dxfSettings.outputFileName = options.filename
        }
        if (options.projection) {
          dxfSettings.projection = options.projection
        }

      convertParams.params.settings = JSON.stringify(dxfSettings)

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
