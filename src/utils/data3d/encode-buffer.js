import Promise from 'bluebird'
import runtime from '../../core/runtime.js'
import gzip from '../file/gzip.js'
import shortId from '../short-id.js'
import traverseData3d from './traverse.js'
import cloneData3d from './clone.js'

// config

var FILE_EXTENSION = '.data3d.buffer'
var HEADER_BYTE_LENGTH = 16
var MAGIC_NUMBER = 0x41443344 // AD3D encoded as ASCII characters in hex
var VERSION = 1

// main

export default function encodeToBuffer (data3d, options) {

  // API
  options = options || {}
  var createFile = options.createFile !== undefined ? options.createFile : true
  var gzipFile = options.gzipFile !== undefined ? options.gzipFile : true
  var filename = options.filename || getFallbackFilename() + FILE_EXTENSION
  
  // internals
  var result = {
    buffer: null,
    file: null,
    warnings: []
  }
  var resultingPromise
  
  // add correct ending
  if (filename.substring( filename.length - FILE_EXTENSION.length ) !== FILE_EXTENSION) filename += FILE_EXTENSION
  
  // decouple heavy arrays from data3d and store them in dataArrays
  
  var payloadArrays = []
  var payloadLength = 0
  var meshes, meshKeys, i, l, array, mesh
  var arrayNames = ['positions', 'normals', 'uvs', 'uvsLightmap'] // heavy arrays
  var _data3d = cloneData3d(data3d)
  traverseData3d( _data3d, function(data3d){
    meshes = data3d.meshes
    meshKeys = data3d.meshKeys || Object.keys(meshes)
    for (i=0, l=meshKeys.length; i<l; i++) {
      mesh = meshes[ meshKeys[i] ]
      arrayNames.forEach(function(name){
        array = mesh[name]
        if (array) {
          if (array.length) {
            // remember offset and length
            mesh[name + 'Offset'] = payloadLength
            mesh[name + 'Length'] = array.length
            // increase overall offset
            payloadLength += array.length
            payloadArrays[payloadArrays.length] = array
          }
          // delete heavy array in structure
          delete mesh[name]
        }
      })
    }
  })
  var payloadByteLength = payloadLength * 4
  
  // create structure
  
  var structure = {
    version: VERSION,
    data3d: _data3d
  }
  
  // serialize structure
  
  var structureString = JSON.stringify( structure, function(key, value) {
    if (value instanceof  Float32Array) {
      // make typed array look like normal array json (otherwise the will look like objects)
      return Array.apply([], value)
    } else {
      return value
    }
  })
  var structureByteLength = structureString.length * 2
  // byte length has to be a multiple of four! adding one string if it is not
  // http://stackoverflow.com/questions/7372124/why-is-creating-a-float32array-with-an-offset-that-isnt-a-multiple-of-the-eleme
  if (!isMultipleOf(structureByteLength, 4)) {
    structureString += ' '
    structureByteLength += 2
  }
  
  // create file buffer
  
  var fileBuffer = new ArrayBuffer( HEADER_BYTE_LENGTH + structureByteLength + payloadByteLength )
  
  // write structure data into file buffer
  
  var structureArray = new Uint16Array( fileBuffer, HEADER_BYTE_LENGTH, structureByteLength / 2 )
  for (i = 0, l = structureString.length; i < l; i++) {
    structureArray[i] = structureString.charCodeAt(i)
  }
  
  // write payload into file buffer
  
  var payloadByteOffset = HEADER_BYTE_LENGTH + structureByteLength
  var payloadArray = new Float32Array( fileBuffer, payloadByteOffset, payloadByteLength / 4 )
  var payloadPointer = 0
  for (i = 0, l = payloadArrays.length; i < l; i++) {
    array = payloadArrays[i]
    payloadArray.set( array, payloadPointer )
    payloadPointer += array.length
  }
  
  // write file header
  
  var fileHeaderArray = new Int32Array( fileBuffer, 0, HEADER_BYTE_LENGTH / 4 )
  // magic number
  fileHeaderArray[0] = MAGIC_NUMBER
  // version number
  fileHeaderArray[1] = VERSION
  // structure length
  fileHeaderArray[2] = structureByteLength
  // payload length
  fileHeaderArray[3] = payloadByteLength
  
  result.buffer = fileBuffer
  
  if (createFile && !gzipFile) {
  
    var file = new Blob([ new DataView(fileBuffer) ], { type: 'application/octet-stream' })
    file.name = filename
    result.file = file
  
  } else if (createFile && gzipFile) {
  
    resultingPromise = gzip.deflate(fileBuffer)
      .then(function (zippedArray) {
        var file = new Blob([ zippedArray ], { type: 'application/x-gzip' })
        file.name = filename.replace('.', '.gz.')
        result.file = file
        return result
      })
  
  }
  
  // make sure that output is a promise
  if (!resultingPromise) {
    resultingPromise = Promise.resolve(result)
  }
  
  // return result
  return resultingPromise.then(function(){
    return createFile ? result.file : result.buffer
  })

}

// helpers

function isMultipleOf (value, multiple) {
  return Math.ceil(value / multiple) === value / multiple
}

function getFallbackFilename () {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + shortId()
}