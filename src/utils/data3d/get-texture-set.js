import Promise from 'bluebird'
import wait from '../wait'
import pathUtil from '../path.js'
import fetchImage from '../io/fetch-image.js'
import callServices from '../services/call.js'
import storagePut from '../../storage/put.js'
import poll from '../poll.js'
import scaleDownImage from '../image/scale-down-image.js'
import getBlobFromCanvas from '../image/get-blob-from-canvas.js'
import getImageFromFile from '../image/get-image-from-file.js'

// main

export default function getTextureSet (input) {

  // internals

  var result = {
    loRes: null,
    source: null,
    dds: null
  }
  var fullSetReadyPromises = []

  // normalize input
  return getSourceCanvasFromInput(input).then(function (sourceCanvas) {

    // TODO: readd back hash based optimizations (should happen on server)

    return Promise.all([
      // generate loRes texture localy and upload it
      getLoResCanvas(sourceCanvas).then(getBlobFromCanvas).then(storagePut).then(function (previewStorageId) {
        // loRes texture uploaded and ready for use
        result.loRes = previewStorageId
      }),
      // upload source texture...
      getBlobFromCanvas(sourceCanvas).then(storagePut).then(function (sourceStorageId) {
        // ... to have it ready for server side processing
        result.source = sourceStorageId
        // ... like DDS conversion (or baking)
        return requestDdsConversion(sourceStorageId).then(function (processingId) {
          // we know the future DDS storageId but will not wait for conversion being done
          // TODO: future storageId should be in status file
          result.dds = sourceStorageId.replace('.jpg', '.hi-res.gz.dds')
          // waiting for DDS converion is optional and up to the user:
          fullSetReadyPromises.push(pollForDdsTexture(processingId))
        })
      })
    ])
  }).then(function () {

    // promise for full texture set
    result.fullSetReady = Promise.all(fullSetReadyPromises).then(function () {
      return result
    })
    return result

  })

}

// private methods

function getSourceCanvasFromInput (input) {
  // input can be url, img, canvas or file
  return Promise.resolve().then(function () {
    if (typeof input === 'string') {
      // infoCallback('Loading image '+file.name)
      return fetchImage(input)
    } else if (input instanceof Blob) {
      // infoCallback('Reading image '+file.name)
      return getImageFromFile(input)
    } else {
      return input
    }
  }).then(function (canvas) {
    // infoCallback(file.name + ' - Generating source texture file')
    // return canvas
    return scaleDownImage(canvas, {
      powerOfTwo: false,
      maxWidth: 2048,
      maxHeight: 2048
    })
  })
}

function getLoResCanvas (sourceCanvas) {
  //infoCallback(file.name + ' - Generating lo-res texture file')
  return scaleDownImage(sourceCanvas, {
    powerOfTwo: true,
    maxWidth: 256,
    maxHeight: 256
  })
}

function requestDdsConversion (sourceStorageId) {
  sourceStorageId = sourceStorageId.substring(1)
  return callServices('Processing.task.enqueue', {
    method: 'convertImage',
    params: {
      inputFileKey: sourceStorageId,
      options: {
        outputFormat: 'dds',
        outputDirectory: pathUtil.parse(sourceStorageId).dir
      }
    }
  })
}

function pollForDdsTexture (processingId) {
  return poll(function (resolve, reject, next) {
    var url = 'https://storage-nocdn.3d.io/' + processingId

    fetch(url).then(function (response) {
      return response.json()
    }).then(function (message) {
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

// rest between heavy operations so that browser doesn't give
// "javascript stuck" warning and garbage collection can kick in
function restDuration () {
  return Math.random() * 50
}