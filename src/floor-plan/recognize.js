import callService  from '../utils/services/call.js'

export default function recognize (args) {
  console.log('starting recognition')
  var el = typeof args === 'string' ? document.querySelector(args) : null

  var url, width, height, pixelsPerMeter

  if (el) {
    // get floor plan image date info from aframe element
    // TODO: replacement for inverted floor plan
    url = 'https://storage.3d.io/132f8fd0-f7e0-432a-ad21-732f3307e77e/2017-08-31_21-55-19_xExGmY/Grundriss_WE17_s.jpg'
    // url = el.attributes.src.value
    width = el.attributes.width.value
    height = el.attributes.height.value

    // TODO: fetch image directly to make sure we get it
    var texture = el.components.material.material.map.image
    pixelsPerMeter = getPixelPerMeterRatio(texture.width, texture.height, width, height)

    console.log(url, width, height, pixelsPerMeter)

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
    colorCoded: false,
    floorPlanUrl: url,
    pixelsPerMeter: pixelsPerMeter
  }

  return callService('Recognizer.recognize', {arguments: args})
}

function getPixelPerMeterRatio(pxWidth, pxHeight, width, height) {

  // from pixels
  var areaPx2 = pxWidth * pxHeight //this.getPixelArea()

  // from input
  var areaM2 = width * height //parseFloat(this.$distanceInput.val())

  var pixelPerMeterRatio = Math.sqrt(areaPx2 / areaM2)

  return pixelPerMeterRatio
}