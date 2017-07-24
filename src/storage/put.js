import FormData from '../utils/io/form-data'
import runtime from '../core/runtime.js'
import callServices from '../utils/services/call.js'
import getShortId from '../utils/short-id.js'
import auth from '../auth.js'
import Promise from 'bluebird'
import fetch from '../utils/io/fetch.js'
import getMimeTypeFromFileName from '../utils/get-mime-type-from-filename.js'

// configs

var ANONYMOUS_USER_ID = 'anonymous-uploads'
var KEY_USER_ID_PLACEHOLDER = '{{userId}}'

// main

export default function putToStore (files, options) {

  options = options || {}

  if (!Array.isArray(files)) {

    // upload single file

    return putSingleFileToStore(files, options)

  } else {

    // upload multiple files and bundle progress events
    // TODO: add dir option

    var totalSize_ = 0
    var progress_ = []
    var onProgress_ = options.onProgress

    return Promise.map(files, function(file, i){
      totalSize_ += file.size
      return putSingleFileToStore(file, {
        dir: options.dir,
        onProgress: function(progress, total){
          progress_[i] = progress
          onProgress_(progress_.reduce(function(a, b) { return a+b; }, 0), totalSize_)
        }
      })
    })

  }

}

// private

function putSingleFileToStore (file, options) {

  // API
  var key = options.key
  var dir = options.dir
  var fileName = options.filename || options.fileName || file.name || 'unnamed.txt'
  var onProgress = options.onProgress

  return resolveKey(key, dir, fileName)
    .then(validateKey)
    .then(function (key) {
      return getCredentials(file, key)
    })
    .then(function (credentials) {
      return uploadFile(file, credentials, onProgress)
    })

}

function resolveKey (key, dir, fileName) {
  // prefer key. fallback to dir + fileName
  key = key ? key : (dir ? (dir[dir.length - 1] === '/' ? dir : dir + '/') + fileName : null)
  var isTemplateKey = key && key.indexOf(KEY_USER_ID_PLACEHOLDER) > -1

  // full key including userId provided
  if (key && !isTemplateKey) return Promise.resolve(key)

  // get user id
  return auth.getSession().then(function(session){
    if (isTemplateKey) {
      if (session.isAuthenticated) {
        // replace user id in template key
        return key.replace( '{{userId}}', session.user.id )
      } else {
        console.error('Using key parameter with template syntax requires authentication.')
        // reject with user friendly error message
        return Promise.reject('Please log in to upload file.')
      }
    } else {
      // key not provided
      var uploadFolder = getFormattedDate() + '_' + getShortId()
      if (session.isAuthenticated) {
        // construct new user specific key
        return '/' + session.user.id + '/' + uploadFolder + '/' + fileName
      } else {
        // construct anonymous key
        return '/' + ANONYMOUS_USER_ID + '/' + uploadFolder + '/' + fileName
      }
    }
  })
}

var keyValidationRegex = /^\/([a-zA-Z0-9\.\-\_]+\/)+([a-zA-Z0-9\.\-\_]+)$/
function validateKey (key) {
  if (keyValidationRegex.test(key)) {
    return Promise.resolve(key)
  } else {
    return Promise.reject(
      'Key format validation failed.\n'
      + key + '\n'
      + 'Key must match the following pattern\n'
      + '- must start with a slash\n'
      + '- must not end with a slash\n'
      + '- must have one or more directories\n'
      + '- must not include double slashes like: "//"\n'
      + '- allowed characters are: a-z A-Z 0-9 _ - . /'
    )
  }
}

function getCredentials (file, key) {
  // strip leading slash
  if (key[0] === '/') key = key.substring(1)
  // get credentials for upload
  return callServices('S3.getCredentials', {
    contentLength: file.size || file.length,
    contentType: getMimeTypeFromFileName(key),
    key: key
  })
}

function uploadFile (file, credentials, onProgress) {
  // upload directly to S3 using credentials
  var fd = new FormData()
  fd.append('key', credentials.key)
  fd.append('AWSAccessKeyId', credentials.AWSAccessKeyId)
  fd.append('acl', credentials.acl)
  fd.append('Content-Type', credentials.contentType)
  fd.append('policy', credentials.policy)
  fd.append('signature', credentials.signature)
  fd.append('success_action_status', '201')
  if (credentials.contentEncoding) {
    fd.append('Content-Encoding', credentials.contentEncoding)
  }
  fd.append('file', file)

  if (runtime.isBrowser) {

    // upload using XHR (in order to provide progress info)
    return new Promise(function(resolve, reject){
      var xhr = new XMLHttpRequest()
      xhr.crossOrigin = 'Anonymous'
      xhr.onload = function (event) {
        if (xhr.status >= 200 && xhr.status < 300) {
          var key = getKeyFromS3Response(xhr.responseText)
          key ? resolve(key) : reject ('Error Uploading File: '+xhr.responseText)
        } else {
          reject ('Error Uploading File: '+xhr.responseText)
        }
      }
      xhr.onerror = function (event) {
        reject(event)
      }
      if (onProgress) {
        xhr.upload.addEventListener('progress', function(e){
          onProgress(e.loaded, e.total)
        }, false)
      }
      xhr.open('POST', credentials.url, true)
      xhr.send(fd)
    })

  } else {

    // node environment: upload using fetch
    return fetch(credentials.url, {method: 'POST', body: fd}).then(function (res) {
      return res.text()
    }).then(function(str){
      return getKeyFromS3Response(str) || Promise.reject('Error Uploading File: '+str)
    })

  }
}

function getKeyFromS3Response (str) {
  // get file key from response
  var s = /<Key>(.*)<\/Key>/gi.exec(str)
  return s ? '/'+s[1] : false
}

function getFormattedDate() {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    + '_' + d.getHours() + '-' + d.getMinutes() // + '-' + d.getSeconds()
}