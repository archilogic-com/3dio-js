export default function hexToRgb(hex) {
  // TODO: check whether input is string (html style) or number (threejs style)
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    round( parseInt(result[1],16)/255, 0.001 ),
    round( parseInt(result[2],16)/255, 0.001 ),
    round( parseInt(result[3],16)/255, 0.001 )
  ] : null
}

// helpers

function round(value, step) {
  step || (step = 1.0)
  var inv = 1.0 / step
  return Math.round(value * inv) / inv
}