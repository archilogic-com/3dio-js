import fetch from '../io/fetch.js'
import decodeBinary from './decode-binary.js'
import getUrlFromStorageId from '../../storage/get-url-from-id.js'

export default function loadData3d (val, options) {

  // could be storageId or URL
  var url = getUrlFromStorageId(val)

  return fetch(url, options).then(function(res){
    return res.arrayBuffer()
  }).then(function(buffer){
    return decodeBinary(buffer, { url: url })
  })
}
