import FormData from '../io/form-data'
import runtime from '../runtime.js'
import callServices from '../services/call.js'
import fetch from '../io/fetch.js'
import getMimeTypeFromFileName from '../utils/get-mime-type-from-filename.js'

// constants

var KEY_PATTERN = /<Key>(.*)<\/Key>/gi

// main

export default function putToStore (file, options) {

  options = options || {}
  var fileName = file.name || options.fileName || 'unnamed.txt'

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

    // upload to S3
    return fetch(credentials.url, {method: 'POST', body: fd})
      .then(function (res) {
        return res.text()
      }).then(function (s3Response) {
        // get file key from response
        var s = KEY_PATTERN.exec(s3Response)
        return s ? '/'+s[1] : Promise.reject('Error Uploading File: '+s3Response)
      })

  })

}