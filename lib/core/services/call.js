import Promise from 'bluebird'
import runtime from '../runtime.js'
import fetch from '../io/fetch.js'
import JsonRpc2Client from './json-rpc2-client.js'
// import cache from './common/promise-cache.js'

// configs
var DEFAULT_API_URL = 'https://spaces.archilogic.com/api/v2'

// internals
var rpcClient = new JsonRpc2Client()

// main

// TODO: add api.onMethod('methodName')
// TODO: add api.onNotification('methodName')

export default function callService (methodName, params) {

  // API
  params = params || {}

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

  sendHttpRequest(rpcRequest)

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

function sendHttpRequest (rpcRequest) {
  // send request
  fetch(DEFAULT_API_URL, {
    body: JSON.stringify(rpcRequest.message),
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
  }).then(function (response) {
    return response.json()
  }).then(function (data) {
    rpcClient.handleResponse(data)
    return null
  }).catch(function (error) {
    rpcRequest.cancel('Sorry, HTTP error occured. Please check your internet connection.')
  })

}