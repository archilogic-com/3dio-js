import callService  from '../utils/services/call.js'
import normalizeFurnitureInfo  from './common/normalize-furniture-info.js'

export default function getFurnitureData3dStorageId (furnitureId) {
  return callService('Product.read', { resourceId:furnitureId }).then(function(rawInfo){

    var info = normalizeFurnitureInfo(rawInfo)

    // some furniture might not have a storage id (i.e. groups)
    var storageId = info && info.data3dStorageId ? info.data3dStorageId : null

    return storageId ? storageId : Promise.reject('This furniture has no own Storage ID (i.e. is a group of furniture objects)')
  })
}