import runtime from './core/runtime.js'
import getData3dFromThreeJs from './a-frame/three/get-data3d.js'

export default function publish(input, options) {

  // detect input type
  if (typeof input === 'string') {

    // selector
    if (input[0] === '#' || input === 'a-scene') {
      return publishFromThreeJs(document.querySelector(input).object3D, options)

    // url
    } else {
      return fetch(input).then(function(response){
        return response.blob()
      }).then(function(blob){
        return publishFromFiles(blob, options)
      })
    }

  // files
  } else if (Array.isArray(input) || input instanceof Blob) {
    return publishFromFiles(input, options)

  // three.js object
  } else if (typeof input === 'object' && input.isObject3D) {
    return publishFromThreeJs(input, options)

  // not supported
  } else {
    throw new Error('Unknown input param')
  }

}

// methods

function publishFromThreeJs(object3D, options) {
  return getData3dFromThreeJs(object3D, options)
    .then(io3d.utils.data3d.encodeBinary)
    .then(io3d.storage.put)
}

// TODO: implement
function publishFromFiles(files, options) {
  if (!Arrray.isArray(files)) files = [files]
  return Promise.reject('Importing files is not supported yet')
}