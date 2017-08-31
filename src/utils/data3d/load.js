import fetch from '../io/fetch.js'
import decodeBinary from './decode-binary.js'

export default function loadData3d (url, options) {
  return fetch(url, options).then(function(res){
    return res.arrayBuffer()
  }).then(function(buffer){
    return decodeBinary(buffer, { url: url })
  })
}
