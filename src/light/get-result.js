import runtime from '../core/runtime.js'
import poll from '../utils/poll.js'
import fetch from '../utils/io/fetch.js'
import urlUtils from '../utils/url.js'

// main

export default function getBakeResult (processingId) {

  return poll(function(resolve, reject, next){
    fetch(urlUtils.resolve('https://storage-nocdn.3d.io',processingId)).then(function(response) {
      return response.json()
    }).then(function(message){
      var status = message.params.status

      if (status === 'ERROR') {
        reject(message.params.data)
      } else if (status === 'SUCCESS') {
        resolve(message.params.data)
      } else {
        next()
      }

    })
  })

}