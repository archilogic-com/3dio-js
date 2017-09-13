import runtime from '../core/runtime'
import configs from '../core/configs'
import loadData3d from '../utils/data3d/load'
import fetch from '../utils/io/fetch'
import getUrlFromStorageId from './get-url-from-id.js'

// main

export default function getFromStorage (storageId, options) {

  // WIP: for now, assume that this is only being used for data3d
  options = options || {}
  options.type = options.type || 'data3d' // TODO: support more types
  var queueName = options.queueName
  var loadingQueuePrefix = options.loadingQueuePrefix

  switch(options.type) {
    case 'json':
      // do not use queue for generic JSON requests
      return fetch(getUrlFromStorageId(storageId, options)).then(function(response) { return response.json() })
    break
    default:
      return loadData3d(getUrlFromStorageId(storageId), {
        queueName: queueName,
        loadingQueuePrefix: loadingQueuePrefix
      })
    break
  }

}