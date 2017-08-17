import Promise from 'bluebird'
import callServices from '../utils/services/call.js'

export default function convertFloorPlanToBasic3dModel (args) {

  // API
  var floorPlan = args.floorPlan
  var address = args.address
  var callback = args.callback

  // send request to server side endpoint
  return callServices('FloorPlan.convertToBasic3dModel', {
    floorplan: floorPlan,
    address: address,
    callback: callback
  }).then(function onSuccess (result) {
    // conversion request accepted
    return result.conversionId
  }).catch(function onError (error) {
    // conversion request error
    // TODO: provide info in debug mode
    return Promise.reject(error)
  })

}