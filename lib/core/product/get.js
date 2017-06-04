import callService  from '../services/call.js'
import getFromStore from '../store/get.js'

export default function getProduct (id) {
  // FIMXE: use proper argument name
  return callService('Product.read', { id:id }).then(function(productInfo){
    return getFromStore(productInfo.fileKey).then(function(data3d){
      productInfo.data3d = data3d
      return productInfo
    })
  })
}