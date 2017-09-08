import fetch from './fetch.js'
import addCacheBustToQuery from './common/add-cache-bust-to-query.js'

export default function checkIfFileExists (url) {
  return fetch(
    addCacheBustToQuery(url),
    {
      method: 'HEAD',
      cache: 'reload'
    }
  ).then(function onSuccess(){
    return true
  }, function onReject(){
    return false
  })
}