import callService  from '../utils/services/call.js'
import getFromStore from '../storage/get.js'
import normalizeFurnitureApiResult  from './common/normalize-furniture-api-result.js'

export default function getFurniture (id) {
  return callService('Product.read', { resourceId:id }).then(function(rawResult){
    return getFromStore(rawResult.fileKey).then(function(data3d){
      // normalize furniture data coming from server side endpoint
      var furnitureData = normalizeFurnitureApiResult(rawResult)
      furnitureData.data3d = data3d
      return furnitureData
    })
  })
}