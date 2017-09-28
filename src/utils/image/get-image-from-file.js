import Promise from 'bluebird'
import readFile from '../file/read.js'
import fetchScript from '../io/fetch-script.js'

// dependencies

var TARGA_PARSER_LIB = 'https://cdn.rawgit.com/archilogic-com/roBrowser/e4b5b53a/src/Loaders/Targa.js'

// main

export default function getImageFromFile (file, options) {

  // API
  options = options || {}
  var format = options.format

  // FIXME get image from blob based on format (to also support DDS, PDF, DXF...)
  // at the moment we assume that blob is JPG or PNG

  var fileName = file.name
  var type = fileName ? fileName.split('.').pop().toLowerCase() : 'jpg'

  if (type === 'jpg' || type === 'jpeg' || type === 'jpe' || type === 'png') {
    return getImageFromJpgOrPngFile(file)

  } else if (type === 'tga') {
    return getImageFromTga(file)

  } else {
    return Promise.reject('Image of type '+type+' not supported')

  }

}

// methods

function getImageFromJpgOrPngFile (file) {
  var filename = file.name
  return new Promise(function(resolve, reject){

    var image = new Image()
    var urlCreator = window.URL || window.webkitURL
    var imageUrl = urlCreator.createObjectURL(file)

    // event handlers
    image.onload = function () {
      urlCreator.revokeObjectURL(imageUrl)
      resolve(image)
    }
    image.onerror = function (error) {
      urlCreator.revokeObjectURL(imageUrl)
      console.error('Error converting image: ' + filename, error)
      reject('Error converting image: ' + filename)
    }

    // initiate loading process
    image.src = imageUrl

  })
}

function getImageFromTga (file) {
  return fetchScript(TARGA_PARSER_LIB).then(function(Targa){
    return readFile(file, 'arrayBuffer').then(function(buffer){
      return new Promise(function(resolve, reject){

        var
          targa = new Targa(),
          image = new Image()

        // add event handlers to image
        image.onload = function () {
          resolve(image)
        }
        image.onerror = function (error) {
          console.error('Error converting image: ' + file.name, error)
          reject('Error converting image: ' + file.name)
        }

        // buffer -> targa
        targa.load(new Uint8Array(buffer))
        // targa -> image
        image.src = targa.getDataURL()

      })
    })
  })
}