import Promise from 'bluebird'
import fetch from '../io/fetch.js'
import decodeBinary from './decode-binary.js'
import queueManager from '../io/common/queue-manager.js'

export default function loadData3d (url, options) {

  options = options || {}
  var queueName
  if (options.queueName) {
    queueName = options.queueName
  } else if (options.loadingQueuePrefix) {
    queueName = options.loadingQueuePrefix + 'Geometries'
  }

  // run

  return queueManager.enqueue(queueName, url).then(function(){

    return fetch(url, options).then(function(res){

      return res.arrayBuffer()

    }).then(function(buffer){

      queueManager.dequeue(queueName, url)
      return decodeBinary(buffer, { url: url })

    })

  }).catch(function (error) {

    queueManager.dequeue(queueName, url)
    return Promise.reject(error)

  })
  
}
