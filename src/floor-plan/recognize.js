import callService  from '../utils/services/call.js'
import normalizeSceneStructure from '../scene/structure/normalize.js'

export default function recognize (args) {
  var el = typeof args === 'string' ? document.querySelector(args) : null

  var url, width, height, pixelsPerMeter

  if (el) {
    // get floor plan image date info from aframe element
    url = el.attributes.src.value
    width = el.attributes.width.value
    height = el.attributes.height.value

    // TODO: fetch image directly to make sure we get it
    var texture = el.components.material.material.map.image
    pixelsPerMeter = getPixelPerMeterRatio(texture.width, texture.height, width, height)

  } else {
    return
    // TODO: add option for user provided arguments & fetch image to get dimensions
    /*
    url = args.url
    width = args.width
    height = args.height
    */
  }

  var args = {
    floorPlanUrl: url,
    pixelsPerMeter: pixelsPerMeter,
    colorCoded: true
  }

  return callService('Recognizer.recognize', {arguments: args})
    .then(function(result) {
      // normalize scene structure to add ids and default values
      return normalizeSceneStructure(result.planStructure)
    })
    .catch(function(error) {
      console.error('Recognition error:', error)
      return Promise.reject('Recognition failed - check console for details')
    })
}

function getPixelPerMeterRatio(pxWidth, pxHeight, width, height) {

  // from pixels
  var areaPx2 = pxWidth * pxHeight //this.getPixelArea()

  // from input
  var areaM2 = width * height //parseFloat(this.$distanceInput.val())

  var pixelPerMeterRatio = Math.sqrt(areaPx2 / areaM2)

  return pixelPerMeterRatio
}