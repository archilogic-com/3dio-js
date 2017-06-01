import fetch from './fetch.js'
import decodeBuffer from '../data3d/decode-buffer.js'

export default function loadData3d (url, options) {
  return fetch(url, options).then(function(res){
    return res.arrayBuffer()
  }).then(function(buffer){
    return decodeBuffer(buffer)
  })
}