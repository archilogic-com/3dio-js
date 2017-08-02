import sendBasicRequest from './request/basic.js'
import sendJsonRequest from './request/json.js'
import sendTextureRequest from './request/texture.js'
import sendDdsTextureRequest from './request/dds-texture.js'
import Promise from 'bluebird'

// main

export default function request(args) {
  // API
  var url = args.url || args.uri
  var method = args.method || 'GET'
  var body = args.body
  var type = getType(args.type, url, body)
  
  // TODO: add support for additional params
  //var headers = args.headers || {}
  //var qs = args.qs

  //var noCache = !!args.noCache

  // TODO: validate params
  if (sendRequestByType[type]) {
    return sendRequestByType[type](url, method, type, body)
  } else {
    return Promise.reject('Type '+type+' not supported.')
  }

}

// shortcuts

request.get = function get (url) {
  return request({
    method: 'GET',
    url: url
  })
}

request.getTexture = function getTexture (url) {
  return request({
    method: 'GET',
    type: 'texture',
    url: url
  })

}

// private properties and methods

var sendRequestByType = {
  'text': sendBasicRequest,
  'arrayBuffer': sendBasicRequest,
  'blob': sendBasicRequest,
  'json': sendJsonRequest, // IE11 does not support responseType=json
  //'ddsTexture': getDdsTexture,
  'imageTexture': sendTextureRequest,
  'ddsTexture': sendDdsTextureRequest
  // TODO: add support for following types
  //'document': sendDocumentRequest,
  //'urlEncoded': sendUrlEncodedRequest,
  //'formData': sendFormDataRequest,
  //'img': sendImgRequest
}

var typeByExtension = {
  'buffer': 'arrayBuffer',
  'txt': 'text',
  'json': 'json'
  // TODO: enable these once support for those types is provided
  //'jpg': 'img',
  //'jpeg': 'img',
  //'jpe': 'img',
  //'png': 'img',
  //'gif': 'img',
  //'xml': 'document',
  //'html': 'document',
  //'svg': 'document'
}

var textureTypeByExtension = {
  '.dds': 'ddsTexture',
  '.jpg': 'imageTexture',
  '.jpeg': 'imageTexture',
  '.jpe': 'imageTexture',
  '.png': 'imageTexture',
  '.gif': 'imageTexture',
  '.svg': 'imageTexture'
}

function getType (type, url, data) {
  if (!url) return 'text'
  var fileName = url.split('/').pop()
  var extension = fileName.split('.').pop()

  if (!type) {

    if (data) {
      // estimate dataType from data
      if (data instanceof FormData) {
        type = 'form-data'
      } else if (_.isObject(data)) {
        type = 'url-encoded'
      }
    } else {
      // estimate dataType from URL
      type = dataTypeFromUrl(url)
    }

    // fallback to text request
    if (!type) {
      type = 'text'
    }

  } else if (type === 'texture') {

    // estimate texture type from URL
    type = getTextureTypeFromUrl(url)

  }

  return type
}

var typeByExtensionKeys = Object.keys(typeByExtension)
function dataTypeFromUrl (url) {

  var extension, i, l, urlLow = url.toLowerCase()

  for (i= 0, l=typeByExtensionKeys.length; i<l; i++ ) {
    extension = typeByExtensionKeys[i]
    if (urlLow.substring( urlLow.length - extension.length ) === extension) {
      return typeByExtension[ extension ]
    }
  }

  return 'text'

}

function getTextureTypeFromUrl (url, isTexture) {

  // get file extension
  var search = url.match(/\.[A-Za-z]+(?=\?|$)/i)

  if (search) {
    var extension = search[ 0 ].toLowerCase()
    return textureTypeByExtension[ extension ]
  } else {
    return false
  }

}