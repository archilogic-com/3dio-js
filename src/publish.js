import runtime from './core/runtime.js'
import storagePut from './storage/put.js'
import getData3dFromThreeJs from './utils/data3d/from-three.js'
import encodeData3dToBinary from './utils/data3d/encode-binary.js'
import whenHiResTexturesReady from './utils/data3d/when-hi-res-textures-ready.js'

// main

/*
 input: dom selector referencing aframe element, file, array of files, three.js Object3D
 returns storageId
 */
function publish(input) {

  return normalizeInput(input)
    .then(encodeData3dToBinary)
    .then(storagePut)

}

// public methods

publish.whenHiResTexturesReady = whenHiResTexturesReady

// private methods

/*
 input: dom selector referencing aframe element, file, array of files, three.js Object3D
 returns data3d
 */
function normalizeInput(input) {

  if (typeof input === 'string') {

    if (input[0] === '#' || input === 'a-scene') {
      // selector
      return getData3dFromThreeJs(document.querySelector(input).object3D)

    } else {
      // url
      return fetch(input).then(function(response){
        return response.blob()
      }).then(getData3dFromFiles)
    }

  } else if (Array.isArray(input) || input instanceof Blob) {
    // files
    return getData3dFromFiles(input)

  } else if (typeof input === 'object' && input.isObject3D) {
    // three.js object
    return getData3dFromThreeJs(input)

  } else {
    // not supported
    throw new Error('Unknown input param')
  }
}

/*
input: file or array of files
returns data3d
 */
function getData3dFromFiles(files) {

  // TODO: implement
  if (!Arrray.isArray(files)) files = [files]
  return Promise.reject('Importing files is not supported yet')

}

// expose API

export default publish