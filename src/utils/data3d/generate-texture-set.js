import Promise from 'bluebird'
import wait from 'wait'
import gzip from 'gzip'
import pathUtil from '../path.js'
import getMd5FileHash from '../file/get-md5-hash.js'
import downScaleImage from '../image/scale-down-image.js'
import getBlobFromCanvas from '../image/get-blob-from-canvas.js'
import getImageFromFile from '../image/get-image-from-file.js'

var s3 = require('s3')
var api = require('api')

// config

// rest between heavy operations so that browser doesn't give
// "javascript stuck" warning and garbage collection can kick in
var REST_DURATION = function() {
  return Math.random() * 50
}
var TARGET_FOLDER = 'textures/uploads'

// main

module.exports = function getTextureSet (file, options) {

  var activePollPromise
  var currentPollState

  // API
  options = options || {}
  var infoCallback = options.onInfo || function(){}
  var warningCallback = options.onWarning || function(){}

  // run

  infoCallback('Reading image '+file.name)
  infoCallback('Generating MD5 hash for image '+file.name)
  return Promise.all([

    getImageFromFile(file),
    getMd5FileHash(file)

  ]).then(function(result){

    var result = { loRes: {}, hiRes: {}, source: {} }

    var conversionPromises = []
    var uploadPromises = []

    // run

    var convertSourceFilePromise = downScaleImage(image, { powerOfTwo: false, maxWidth: 2048, maxHeight: 2048 })


    convertSourceFilePromise.then(function(sourceFile){

      var convertLoResFilePromise =
      var convertSourceFilePromise = genrate

    })
    var

    // generate source image

    infoCallback('Generate source texture from image ' + file.name)
    return wait(REST_DURATION())
      .then(function () {
        return downScaleImage(image, { powerOfTwo: false, maxWidth: 2048, maxHeight: 2048 })
      })
      .then(function (canvas) {
        infoCallback(file.name + ' - Generating source texture file')
        return wait(REST_DURATION(), canvas)
      })
      .then(function (canvas) {
        return getBlobFromCanvas(canvas, { mimeType: 'image/jpeg', quality: 97, fileName: fileHash + '.source.jpg' })
      }, makeErrorHandler('Error resizing image ' + file.name, warningCallback))
      .then(function (file) {
        infoCallback(file.name + ' - Uploading source file')
        var convertDdsDuration = 0
        return Promise.all([

          // upload source to s3
          s3.put(file,{
            userFolder: TARGET_FOLDER,
            hidden: true
          }).then(function(s3Key){
            s3Keys.source = ensureLeadingSlash(s3Key)
            // api call to get dds
            infoCallback(file.name + ' - Generating Hi-Res DDS gzipped texture file')
            convertDdsDuration = Date.now()
            var outputFileKey = pathUtil.dir(s3Key) + '/' +  fileHash + '.hi-res.gz.dds'
            // send API request if DDS file does not yet exist on S3
            return s3
              .checkIfFileExists(outputFileKey)
              .then(function(fileDoesExist){
                if (fileDoesExist) {
                  return outputFileKey

                } else {
                  return api.call('Processing.task.enqueue', {
                    method: 'convertImage',
                    params: {
                      inputFileKey: s3Key,
                      options: {
                        outputFormat: 'dds',
                        outputDirectory: pathUtil.dir(s3Key)
                      }
                    }
                  }) .then(function onApiResponse (statusFileKey){
                    return pollTask(statusFileKey)
                  })
                    .then(function onTaskSuccessful (fileKey) {
                      // poll for file
                      return s3.poll(fileKey, {
                        checkOnlyIfFileExists: true,
                        timeout: 15 * 60 * 1000,
                      })
                    })
                }
              })

          }).then(function(s3Key){
            s3Keys.hiRes = ensureLeadingSlash(s3Key)
            convertDdsDuration = Date.now() - convertDdsDuration
            infoCallback(file.name + ' - DDS hi-res texture generated in ' + Math.round(convertDdsDuration/100)/10 + 's')
          }),

          // lo-res
          wait(REST_DURATION()).then(function(){
            infoCallback(file.name + ' - Generating lo-res texture file')
            return downScaleImage(image, {
              powerOfTwo: true,
              maxWidth: 256,
              maxHeight: 256
            })
          })
            .then(function (canvas) {
              return getBlobFromCanvas(canvas, {
                mimeType: 'image/jpeg',
                quality: 97,
                fileName: fileHash + '.lo-res.jpg'
              })
            })
            .then(function(file){
              infoCallback(file.name + ' - Uploading lo-res texture file')
              return s3.put(file,{
                userFolder: TARGET_FOLDER,
                hidden: true
              })
            })
            .then(function(s3Key){
              s3Keys.loRes = ensureLeadingSlash(s3Key)
            })

        ])
      })
      .then(function () {

        return {
          s3Keys: s3Keys,
          sourceWidth: image.width,
          sourceHeight: image.height
        }

      })

  })

  function pollTask (statusFileKey) {
    var pollPromise
    pollPromise = activePollPromise = s3.poll(statusFileKey, {
      checkContent: function checkStatusContent (content) {
        if (content && content.params) {
          if (content.params.status === 'PROCESSING') {
            showUiMessage(content, 'success')
          } else if (content.params.status !== 'ENQUEUED') return true
        }
      },
      minInterval: 1 * 1000,
      maxInterval: 10 * 1000,
      intervalIncreaseFactor: 1.4,
      timeout: 15 * 60 * 1000
    })
      .then(function parseStatus (content) {
        if (content.params && content.params.status && content.params.status === 'SUCCESS') {
          showUiMessage(content, 'success')
          return content.params.data
        } else {
          showUiMessage(content, 'alert')
          return Promise.reject(content)
        }
      })
    return pollPromise
  }

  function stopPoll () {
    activePollPromise = null
    currentPollState = null
  }

  function showUiMessage (content, alertType) {
    if (content.params && content.params.status && content.params.status !== currentPollState) {
      currentPollState = content.params.status
      console.log('Task status: ' + content.params.status + '\n' + content.params.data + '\n TaskId: ' + content.params.taskId)
    }
  }

}

// helper

function makeErrorHandler (message, callback) {
  return function handleError(error) {
    console.error(message, error)
    if (callback) {
      callback(message)
    }
  }
}

function ensureLeadingSlash(key) {
  if (key[0] !== '/') {
    return '/' + key
  } else {
    return key
  }
}