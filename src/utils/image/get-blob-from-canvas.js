import Promise from 'bluebird'
import runtime from '../../core/runtime.js'
import getDefaultFilename from '../file/get-default-filename.js'

export default function getBlobFromCanvas (canvas, options) {
  runtime.assertBrowser()

  // API
  options = options || {}
  var mimeType = options.mimeType || 'image/jpeg' // can be: 'image/jpeg' or 'image/png'
  var quality = options.quality || 98
  var fileName = options.fileName || getDefaultFilename() + (mimeType === 'image/jpeg' ? '.jpg' : '.png')

  // run
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      blob.name = fileName
      resolve(blob)
    }, mimeType, quality)
  })

}