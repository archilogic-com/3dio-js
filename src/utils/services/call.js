import runtime from '../../core/runtime.js'
import configs from '../../core/configs.js'
import fetch from '../../utils/io/fetch.js'
import JsonRpc2Client from './json-rpc2-client.js'
// import cache from './common/promise-cache.js'

// internals
var rpcClient = new JsonRpc2Client()

// main

// TODO: add api.onMethod('methodName')
// TODO: add api.onNotification('methodName')

export default function callService (methodName, params, options) {

  // API
  params = params || {}
  options = options || {}
  var secretKey = options.secretKey

  // try cache
  // var cacheKey
  // if (useCache) {
  //   cacheKey = JSON.stringify([methodName, params, options])
  //   var promiseFromCache = cache.get(cacheKey)
  //   if (promiseFromCache) {
  //     return promiseFromCache
  //   }
  // }

  // internals
  var rpcRequest = rpcClient.createRequest(methodName, params)

  sendHttpRequest(rpcRequest, secretKey)

  // add to cache
  // if (useCache) {
  //   cache.add(cacheKey, rpcRequest.promise)
  // }

  return rpcRequest.promise

}

// private

function handleError (error, additionalInfo) {
  console.warn(error || 'API Connection Error', additionalInfo)
}

function handleIncomingMessage (event) {
  var message
  try {
    message = JSON.parse(event.data)
  } catch (e) {
    // non-valid JSON
    handleError('Incoming message is not valid JSON format.', event.data)
    return
  }

  if (message && !message.method) {
    // has no method = it's a response
    rpcClient.handleResponse(message)

  } else if (message.method) {
    if (message.id) {
      // method call
      // TODO: trigger onMethod event
    } else {
      // notification call
      // TODO: trigger onNotification event
    }
  }
}

function sendHttpRequest (rpcRequest, secretKey) {

  var isTrustedOrigin = ( runtime.isBrowser && window.location.href.match(/^[^\:]+:\/\/([^\.]+\.)?(3d\.io|archilogic.com|localhost)(:\d+)?\//) )
  var headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  if (secretKey) headers['X-Secret-Key'] = secretKey

  // send request
  fetch(configs.servicesUrl, {
    body: JSON.stringify(rpcRequest.message),
    method: 'POST',
    headers: headers,
    credentials: (isTrustedOrigin ? 'include' : 'omit' ) //TODO: Find a way to allow this more broadly yet safely
  }).then(function (response) {
    // try to parse JSON in any case because valid JSON-RPC2 errors do have error status too
    response.json().then(function onParsingSuccess(data){
      // rpc client will handle JSON-RPC2 success messages and errors and resolve or reject prcRequest promise accordingly
      rpcClient.handleResponse(data)
    }).catch(function onParsingError(){
      // response is not a valid json error message. (most likely a network error)
      var errorMessage = 'API request to '+configs.servicesUrl+' failed: '+response.status+': '+response.statusText+'\nOriginal JSON-RPC2 request: '+JSON.stringify(rpcRequest.message, null, 2)
      console.error(errorMessage)
      rpcRequest.cancel(errorMessage)
    })
  })

}