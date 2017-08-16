import Promise from 'bluebird'
import callServices from '../utils/services/call.js'

export default function getConversionStatus (args) {

  // API
  var conversionId = args.conversionId

  // send request to server side endpoint
  return callServices('FloorPlan.getConversionStatus', {
    conversionId: conversionId
  }).catch(function onError (error) {
    // conversion request error
    // TODO: provide info in debug mode
    return Promise.reject(error)
  })

}