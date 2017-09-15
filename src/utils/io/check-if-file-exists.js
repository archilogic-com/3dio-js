import fetch from './fetch.js'
import addCacheBustToQuery from './common/add-cache-bust-to-query.js'

export default function checkIfFileExists (url) {
  return fetch(
    addCacheBustToQuery(url),
    {
      method: 'HEAD',
      cache: 'reload'
    }
  ).then(function onSuccess(response){
    // response.ok provides boolean type information on request status
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    return response.ok
  }, function onReject(){
    return false
  })
}