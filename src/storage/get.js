import runtime from '../core/runtime.js'
import configs from '../core/configs.js'
import loadData3d from '../utils/data3d/load.js'

// main

export default function getFromStorage (key, options) {

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
  var processedKey = key
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
  var url = 'https://'+(cdn ? configs.storageDomain : configs.storageDomainNoCdn)+'/' + processedKey
  // add to cache
  // keyToUrlCache[ key + cdn + encode ] = url
  return url
}