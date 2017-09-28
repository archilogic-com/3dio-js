import configs from '../core/configs.js'
import getUrlFromStorageId from './get-url-from-id.js'

// main
export default function getNoCdnUrlFromStorageId (storageId) {

  return getUrlFromStorageId(storageId, { cdn: false })

}