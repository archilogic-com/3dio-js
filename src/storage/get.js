import runtime from '../core/runtime.js'
import loadData3d from '../utils/data3d/load.js'

// constants

var CDN_DOMAIN = 'dnvf9esa6v418.cloudfront.net'
var BUCKET = 'archilogic-content-beta'

// main

export default function getFromStore (key, options) {

  // WIP: for now, assume that this is only being used for data3d
  // TODO: use options.type or filename extension to specify loader
  return loadData3d(convertKeyToUrl(key))

}

// helpers

function convertKeyToUrl (key, options) {
  // API
  options = options || {}
  var cdn = options.cdn !== undefined ? options.cdn : true
  var encode = options.encode !== undefined ? options.encode : true
  // check cache
  // if (keyToUrlCache[ key + cdn + encode ]) {
  //   return keyToUrlCache[ key + cdn + encode ]
  // }
  // internals
  var url, processedKey = key
  // remove leading slash
  var startsWithSlash = /^\/(.*)$/.exec(processedKey)
  if (startsWithSlash) {
    processedKey = startsWithSlash[1]
  }
  // encode key if containig special chars
  if (encode && !/^[\.\-\_\/a-zA-Z0-9]+$/.test(processedKey)) {
    processedKey = encodeURIComponent(processedKey)
  }
  // compose url
  if (cdn) {
    url = 'https://'+CDN_DOMAIN+'/' + processedKey
  } else {
    // http://s3-eu-west-1.amazonaws.com/<bucket-name>/<s3-key>
    // http://<bucket-name>.s3-website-eu-west-1.amazonaws.com // has index.html functionality
    // http://<bucket-name>.s3.amazon.com/<s3-key>
    url = 'https://'+BUCKET+'.s3.amazonaws.com/' + processedKey
  }
  // add to cache
  // keyToUrlCache[ key + cdn + encode ] = url
  return url
}