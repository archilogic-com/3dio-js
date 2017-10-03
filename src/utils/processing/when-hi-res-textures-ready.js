import getUrlFromStorageId from '../../storage/get-url-from-id.js'
import getNoCdnUrlFromStorageId from '../../storage/get-no-cdn-url-from-id.js'
import poll from '../poll.js'
import checkIfFileExists from '../io/check-if-file-exists.js'
import loadData3d from '../data3d/load.js'
import decodeBinaryData3d from '../data3d/decode-binary.js'
import getTextureKeys from '../data3d/get-texture-keys.js'

/*
input: data3d (object or binary) or storageId (referencing data3d)
returns promise
 */

export default function whenHiResTexturesReady (input) {

  // resolves when hi-res textures are available
  // - DXT (DDS) for hires on desktop
  // - PVRTC for iOS (not yet implemented)
  // - ETC1 for Android (not yet implemented)

  return normalizeInput(input).then(function (data3d) {

    var values = getTextureKeys(data3d, {
      filter: function (value, type, format, material, data3d) {
        return format === 'dds' ? value : null
      }
    })

    return Promise.all(values.map(pollTexture))

  })

}

// helpers

function normalizeInput(input) {
  var inputType = typeof input
  if (inputType === 'string') {
    // load data3d from URL
    var url = getUrlFromStorageId(input)
    return loadData3d(url)
  } else if (input instanceof Blob) {
    // decode binary data3d
    return decodeBinaryData3d(input)
  } else if (inputType === 'object') {
    // data3d object
    return Promise.resolve(input)
  } else {
    return Promise.reject('Unknown param type')
  }
}

// poll for DDS storageIds

function pollTexture(storageId) {

  var url = getNoCdnUrlFromStorageId(storageId)

  return poll(function (resolve, reject, next) {

    checkIfFileExists(url).then(function(exists){
      exists ? resolve() : next()
    })

  })

}