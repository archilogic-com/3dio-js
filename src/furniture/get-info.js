import callService  from '../utils/services/call.js'
import normalizeFurnitureInfo  from './common/normalize-furniture-info.js'

export default function getFurnitureInfo (id) {
  return callService('Product.read', { resourceId:id }).then(function(rawInfo){
    return normalizeFurnitureInfo(rawInfo)
  })
}