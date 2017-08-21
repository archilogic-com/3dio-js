import callService  from '../utils/services/call.js'
import normalizeFurnitureInfo from './common/normalize-furniture-info.js'

export default function searchFurniture (query, options) {

  // API
  options = options || {}
  var limit = options.limit || 50
  // TODO: add this param once #251 https://github.com/archilogic-com/services/issues/251 is resolved
  //var offset = options.offset || 0

  // internals
  var apiErrorCount = 0
  // call API
  function callApi () {
    return callService('Product.search', {
      searchQuery: {query: 'isPublished:true ' + query},
      limit: limit
      // TODO: add this param once #251 https://github.com/archilogic-com/services/issues/251 is resolved
      //offset: offset
    }).then(function onSuccess (rawResults) {
      apiErrorCount = 0
      // normalize furniture data coming from server side endpoint
      return rawResults.map(normalizeFurnitureInfo)
    }, function onReject (err) {
      console.error('Error fetching furniture:', err)
      // try again 3 times
      return ++apiErrorCount < 3 ? callApi() : Promise.reject('Whoops, that did not work, please try another query.')
    })
  }
  // expose
  return callApi()

}