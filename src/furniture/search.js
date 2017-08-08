import callService  from '../utils/services/call.js'
import normalizeFurnitureApiResult  from './common/normalize-furniture-api-result.js'

export default function searchFurniture (query, options) {

  // API
  options = options || {}
  var limit = options.limit || 50
  //var offset = options.offset || 0

  // internals
  var apiErrorCount = 0
  // call API
  function callApi () {
    return io3d.utils.services.call('Product.search', {
      searchQuery: {query: 'isPublished:true ' + query},
      limit: limit
      //offset: offset
    }).then(function onSuccess (rawResults) {
      apiErrorCount = 0
      // normalize furniture data coming from server side endpoint
      return rawResults.map(normalizeFurnitureApiResult)
    }, function onReject (err) {
      console.error('Error fetching furniture:', err)
      // try again 3 times
      return ++apiErrorCount < 3 ? callApi() : Promise.reject('Whoops, that did not work, please try another query.')
    })
  }
  // expose
  return callApi()

}