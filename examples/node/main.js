var BASE = require('../../build/base-query.js')

var s3Key = '/3f995099-d624-4c8e-ab6b-1fd5e3799173/170420-1105-7yb890/8db476b3-7eb7-45a7-a09b-03e965f12685.gz.data3d.buffer'

var s3Prefix = 'https://dnvf9esa6v418.cloudfront.net'
var url = s3Prefix + s3Key

// send request
console.time('fetch buffer')
fetch(url)
  .then(function(res) {
    // get buffer
    return res.buffer()
  })
  .then(function(buffer){
    console.timeEnd('fetch buffer')

    // convert to arrayBuffer
    console.time('conver to arrayBuffer')
    var arrayBuffer = convertToArrayBuffer(buffer)
    console.timeEnd('conver to arrayBuffer')

    // decode to data3d
    console.time('decode data3d')
    return BASE.data3d.decodeBuffer( arrayBuffer )
  })
  .then(function(data3d){
    console.timeEnd('decode data3d')
    // log

  })


// helper

function convertToArrayBuffer (b) {
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
}

function convertToUint32Array (b) {
  return new Uint32Array(b.buffer, b.byteOffset, b.byteLength / Uint32Array.BYTES_PER_ELEMENT)
}