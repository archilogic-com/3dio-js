import Promise from 'bluebird'
import runtime from '../../../core/runtime.js'

// internals

// graphic card max supported texture size
var MAX_TEXTURE_SIZE = runtime.has.webGl ? runtime.webGl.maxTextureSize || 2048 : 2048

// helpers

function checkPowerOfTwo (value) {
  return ( value & ( value - 1 ) ) === 0 && value !== 0
}

function nearestPowerOfTwoOrMaxTextureSize (n) {
  // max texture size supported by vga
    if (n > MAX_TEXTURE_SIZE) {
        return MAX_TEXTURE_SIZE
    }
  // next best power of two
  var l = Math.log(n) / Math.LN2;
  return Math.pow(2, Math.round(l))
}

function resizeImage (image, url) {

  var width = nearestPowerOfTwoOrMaxTextureSize(image.width)
  var height = nearestPowerOfTwoOrMaxTextureSize(image.height)

  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(image, 0, 0, width, height)

  console.log('Image size not compatible. Image has been resized from ' + image.width + 'x' + image.height + 'px to ' + canvas.width + 'x' + canvas.height +
  'px.\n' + url)

  return canvas
}

// function

export default function sendTextureRequest (url, type, dataType, data, progress, s3Key) {
  return new Promise(function (resolve, reject) {
    
    var image = document.createElement('img')
    image.crossOrigin = 'Anonymous'

    image.onload = function () {
      
      var texture = new THREE.Texture()

      texture.sourceFile = url
      texture.url = url

      // image size compatibility check

      var isPowerOfTwo = (checkPowerOfTwo(image.width) && checkPowerOfTwo(image.height))
      var isNotTooBig = (image.width <= MAX_TEXTURE_SIZE && image.height <= MAX_TEXTURE_SIZE)

      if (isPowerOfTwo && isNotTooBig) {

        // use image as it is
        texture.image = image

      } else {

        // resize image to make it compatible
        texture.image = resizeImage(image, url)
        // add url reference
        texture.image.src = url

      }
      
      resolve(texture)

    }

    var triedWithCacheBust = false
    image.onerror = function () {
      if(triedWithCacheBust) {
        reject('Error loading texture ' + url)
      } else {
        // try again with cache busting to avoid things like #1510
        triedWithCacheBust = true
        if (url.indexOf('?') === -1) {
          url += '?cacheBust=' + new Date().getTime()
        } else {
          url += '&cacheBust=' + new Date().getTime()
        }
        image.src = url
      }
    }

    // initiate image loading
    image.src = url

  })
}