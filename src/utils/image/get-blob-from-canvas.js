import Promise from 'bluebird'
import runtime from '../../core/runtime.js'

export default function getBlobFromCanvas (canvas, options) {
  runtime.assertBrowser()

  // API
  options = options || {}
  var mimeType = options.mimeType || 'image/jpeg' // can be: 'image/jpeg' or 'image/png'
  var quality = options.quality || 98
  var fileName = options.fileName || fileUtils.getFallbackFilename() + (mimeType === 'image/jpeg' ? '.jpg' : '.png')

  // run
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      blob.name = fileName
      resolve(blob)
    }, mimeType, quality)
  })

}