import fetch from '../io/fetch.js'
import decodeBuffer from './decode-buffer.js'

export default function loadData3d (url, options) {
  return fetch(url, options).then(function(res){
    return res.arrayBuffer()
  }).then(function(buffer){
    return decodeBuffer(buffer)
  })
}