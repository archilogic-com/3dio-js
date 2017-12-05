import Promise from 'bluebird'
import callServices from '../utils/services/call.js'
import uuid from '../utils/uuid.js'

export default function convertFloorPlanToPremium3dModel (args) {

  // API
  var floorPlan = args.floorPlan
  var jobId = args.jobId
  var address = args.address
  var callback = args.callback

  if (!jobId) jobId = uuid.generate()

  // send request to server side endpoint
  return callServices('FloorPlan.convertToPremium3dModel', {
    arguments: {
      jobId: jobId,
      floorplan: floorPlan,
      address: address,
      callback: callback
    }
  }).then(function onSuccess (result) {
    // conversion request accepted
    return result.conversionId
  }).catch(function onError (error) {
    // conversion request error
    // TODO: provide info in debug mode
    return Promise.reject(error)
  })

}
