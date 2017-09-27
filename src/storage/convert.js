import getConvertableTextures from './get-convertable-textures.js'
import callServices from '../utils/services/call.js'
import whenDone from '../light/when-done.js'

function getConverter(format) {
  return function convert(storageId, options) {
    // API
    options = options || {}
    var filename = options.filename !== undefined ? options.filename : null

    return getConvertableTextures(storageId).then(function(textureKeys) {
      return callServices('Processing.task.enqueue', {
        method: 'convert',
        params: {
          inputFileKey: storageId,
          options: {
            inputAssetKeys: textureKeys,
            outputFormat: format,
            outputFilename: filename
          }
        }
      })
    })
  }
}

export default {
  exportDae: getConverter('dae'),
  exportObj: getConverter('obj')
}
