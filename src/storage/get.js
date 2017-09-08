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

  switch(options.type) {
    case 'json':
      return fetch(getUrlFromStorageId(storageId, options)).then(function(response) { return response.json() })
    break
    default:
      return loadData3d(getUrlFromStorageId(storageId))
    break
  }

}