import FormData from '../utils/io/form-data'
import runtime from '../core/runtime.js'
import callServices from '../utils/services/call.js'
import Promise from 'bluebird'
import fetch from '../utils/io/fetch.js'
import getMimeTypeFromFileName from '../utils/get-mime-type-from-filename.js'

// main

export default function putToStore (files, options) {

  if (!Array.isArray(files)) {

    // upload single file

    return putSingleFileToStore(files, options)

  } else {

    // upload multiple files and bundle progress events

    var totalSize_ = 0
    var progress_ = []
    var onProgress_ = options.onProgress

    return Promise.map(files, function(file, i){
      totalSize_ += file.size
      return putSingleFileToStore(file, {
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

  options = options || {}
  var fileName = file.name || options.fileName || 'unnamed.txt'
  var onProgress = options.onProgress

  // get credentials for S3
  return callServices('S3.getCredentials', {
    contentLength: file.size || file.length,
    contentType: getMimeTypeFromFileName(fileName),
    fileName: fileName
  }).then(function (credentials) {

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
    //fd.append('success_action_redirect', 'http://google.com')
    //fd.append('expiration',s3Credetials.plainPolicy.expiration)
    fd.append('file', file)

    if (runtime.isBrowser) {

      // upload using XHR (gets progress info)
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

      // upload using fetch
      return fetch(credentials.url, {method: 'POST', body: fd}).then(function (res) {
        return res.text()
      }).then(function(str){
        return getKeyFromS3Response(str) || Promise.reject('Error Uploading File: '+str)
      })

    }

  })

}

function getKeyFromS3Response (str) {
  // get file key from response
  var s = /<Key>(.*)<\/Key>/gi.exec(str)
  return s ? '/'+s[1] : false
}