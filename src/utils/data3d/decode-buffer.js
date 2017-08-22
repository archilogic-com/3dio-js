import runtime from '../../core/runtime.js'
import pathUtil from '../path.js'
import urlUtil from '../url.js'
import Promise from 'bluebird'

// configs

var HEADER_BYTE_LENGTH = 16
var MAGIC_NUMBER = 0x41443344 // AD3D encoded as ASCII characters in hex
var VERSION = 1
var TEXTURE_PATH_KEYS = [
  // source
  'mapDiffuseSource',
  'mapSpecularSource',
  'mapNormalSource',
  'mapAlphaSource',
  'mapLightSource',
  // hi-res
  'mapDiffuse',
  'mapSpecular',
  'mapNormal',
  'mapAlpha',
  'mapLight',
  // preview
  'mapDiffusePreview',
  'mapSpecularPreview',
  'mapNormalPreview',
  'mapAlphaPreview',
  'mapLightPreview'
]
// TODO: use StringDecoder in Node environment
var textDecoder = runtime.isBrowser && window.TextDecoder ? new window.TextDecoder('utf-16') : makeUtf16Decoder()

// public methods

export default function decodeBuffer (buffer, options) {

  // API
  options = options || {}
  var url = options.url

  var parsedUrl = urlUtil.parse(url)
  var rootDir = pathUtil.parse(parsedUrl.path || parsedUrl.pathname || '').dir
  var origin = parsedUrl.protocol + '//' + parsedUrl.host

  // check buffer type
  if (!buffer) {
    return Promise.reject('Missing buffer parameter.')
  } else if (typeof Buffer !== 'undefined' && buffer instanceof Buffer) {
    // convert node buffer to arrayBuffer
    buffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  }

  // internals
  var headerArray = new Int32Array(buffer, 0, HEADER_BYTE_LENGTH / 4)
  var magicNumber = headerArray[0]
  var version = headerArray[1]
  var structureByteLength = headerArray[2]
  var payloadByteLength = headerArray[3]
  var expectedFileByteLength = HEADER_BYTE_LENGTH + structureByteLength + payloadByteLength

  // validation warnings

  if (magicNumber !== MAGIC_NUMBER) {
    console.error('File header error: Wrong magic number. File is probably not data3d buffer format.')
  }
  if (version !== VERSION) {
    console.error('File header error: Wrong version number: ' + version + '. Parser supports version: ' + VERSION)
  }

  // validation errors

  if (buffer.byteLength !== expectedFileByteLength) {
    var errorMessage = 'Can not parse Data3d buffer. Wrong buffer size: ' + buffer.byteLength + ' Expected: ' + expectedFileByteLength
    console.error(errorMessage)
    return Promise.reject(errorMessage)
  }

  // parse structure info

  var structureArray = new Uint16Array(buffer, HEADER_BYTE_LENGTH, structureByteLength / 2)
  var structureString = textDecoder.decode(structureArray)
  var structure
  try {
    structure = JSON.parse(structureString)
  } catch (e) {
    return Promise.reject(e)
  }

  
  // add geometry arrays to data3d

  var payloadByteOffset = HEADER_BYTE_LENGTH + structureByteLength
  traverseData3d(structure.data3d, function (data3d) {

    // map typed arrays to payload area in file buffer
    mapArraysToBuffer(data3d, buffer, payloadByteOffset, url)

    //  convert relative material keys into absolute once
    if (origin && data3d.materials) convertTextureKeys(data3d, origin, rootDir)

  })

  return Promise.resolve(structure.data3d)

}

// text decoder shim
function makeUtf16Decoder () {
  return {

    decode: function decodeText (a) {
      var
        string = '',
        // ignore any initial character other than '{' = 123 and '[' = 91 (>> bug #9818)
        i = a[0] === 123 || a[1] === 91 ? 0 : 1,
        l20 = a.length - 20,
        l2 = a.length
      // passing 20 arguments into fromCharCode function provides fastest performance
      // (based on practical performance testing)
      for (; i < l20; i += 20) {
        string += String.fromCharCode(
          a[i], a[i + 1], a[i + 2], a[i + 3], a[i + 4], a[i + 5], a[i + 6], a[i + 7], a[i + 8], a[i + 9],
          a[i + 10], a[i + 11], a[i + 12], a[i + 13], a[i + 14], a[i + 15], a[i + 16], a[i + 17], a[i + 18], a[i + 19]
        )
      }
      // the rest we do char by char
      for (; i < l2; i++) {
        string += String.fromCharCode(a[i])
      }
      return string
    }

  }
}

function convertTextureKeys (data3d, origin, rootDir) {

  var i, l, i2, l2, m, materialKeys = data3d.materialKeys || Object.keys(data3d.materials || {}), texturePathKey

  for (i = 0, l = materialKeys.length; i < l; i++) {
    m = data3d.materials[materialKeys[i]]

    // hi-res textures
    for (i2 = 0, l2 = TEXTURE_PATH_KEYS.length; i2 < l2; i2++) {
      texturePathKey = TEXTURE_PATH_KEYS[i2]
      if (m[texturePathKey]) {
        if (m[texturePathKey][0] === '/') {
          // absolute path
          m[texturePathKey] = origin + m[texturePathKey]
        } else {
          // relative path
          m[texturePathKey] = origin + rootDir +'/'+ m[texturePathKey]
        }
      }
    }

  }

}

function mapArraysToBuffer (data3d, buffer, payloadByteOffset, url) {

  var mesh, i, l, meshKeys = data3d.meshKeys || Object.keys(data3d.meshes || {})

  for (i = 0, l = meshKeys.length; i < l; i++) {
    mesh = data3d.meshes[meshKeys[i]]

    // map arrays to meshes
    if (mesh.positionsOffset !== undefined && mesh.positionsLength !== undefined) {
      mesh.positions = new Float32Array(buffer, payloadByteOffset + mesh.positionsOffset * 4, mesh.positionsLength)
      delete mesh.positionsOffset
      delete mesh.positionsLength
    }
    if (mesh.normalsOffset !== undefined && mesh.normalsLength !== undefined) {
      mesh.normals = new Float32Array(buffer, payloadByteOffset + mesh.normalsOffset * 4, mesh.normalsLength)
      delete mesh.normalsOffset
      delete mesh.normalsLength
    }
    if (mesh.uvsOffset !== undefined && mesh.uvsLength !== undefined) {
      mesh.uvs = new Float32Array(buffer, payloadByteOffset + mesh.uvsOffset * 4, mesh.uvsLength)
      delete mesh.uvsOffset
      delete mesh.uvsLength
    }
    if (mesh.uvsLightmapOffset !== undefined && mesh.uvsLightmapLength !== undefined) {
      mesh.uvsLightmap = new Float32Array(buffer, payloadByteOffset + mesh.uvsLightmapOffset * 4, mesh.uvsLightmapLength)
      delete mesh.uvsLightmapOffset
      delete mesh.uvsLightmapLength
    }

    // add cache key
    if (url) mesh.cacheKey = url + ':' + meshKeys[i]

  }

}

function traverseData3d (data3d, callback) {

  callback(data3d)

  if (data3d.children) {
    for (var i = 0, l = data3d.children.length; i < l; i++) {
      traverseData3d(data3d.children[i], callback)
    }
  }

}