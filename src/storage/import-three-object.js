import runtime from '../core/runtime.js'
import storagePut from './put.js'
import getData3dFromThreeJs from '../utils/data3d/from-three.js'
import encodeData3dToBinary from '../utils/data3d/encode-binary.js'
import whenHiResTexturesReady from '../utils/processing/when-hi-res-textures-ready.js'

// main

export default function importThreeObject(o) {

  return getData3dFromThreeJs(o)
    .then(encodeData3dToBinary)
    .then(storagePut)

}