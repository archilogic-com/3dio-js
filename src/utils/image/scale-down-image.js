import Promise from 'bluebird'
import runtime from '../../core/runtime.js'

// settings

var DEFAULT_MAX_WIDTH = 2048
var DEFAULT_MAX_HEIGHT = 2048

// main

export default function scaleDownImage (input, options) {
  runtime.assertBrowser()

  // API
  options = options || {}
  var maxWidth = options.maxWidth || DEFAULT_MAX_WIDTH
  var maxHeight = options.maxHeight || DEFAULT_MAX_HEIGHT
  var powerOfTwo = !!options.powerOfTwo

  // run
  return new Promise(function(resolve, reject){

    // internals
    var canvas
    var scale
    var result
    var originalWidth = input.width
    var originalHeight = input.height

    // convert original image size to power of two before scaling
    // because pixelPerfect algorithm allows only one dimensional scaling
    var makePowerOfTwo = powerOfTwo && !(checkPowerOfTwo(originalWidth) && checkPowerOfTwo(originalHeight))
    if (makePowerOfTwo) {
      originalWidth = getNearestPowerOfTwo(originalWidth)
      originalHeight = getNearestPowerOfTwo(originalHeight)
    }

    // cap width and height to max
    var width = Math.min(originalWidth, maxWidth)
    var height = Math.min(originalHeight, maxHeight)

    // scale down smaller size
    if (originalWidth < originalHeight) {
      width = height * (originalWidth / originalHeight)
    } else {
      height = width * (originalHeight / originalWidth)
    }

    // normalize input
    canvas = getCanvas(input, originalWidth, originalHeight)

    // scale if needed
    scale = width / originalWidth
    if (scale < 1) {
      // scale image
      result = downScaleCanvas(canvas, width / originalWidth)
    } else {
      // nothing to scale
      result = canvas
    }

    resolve(result)

  })
}

// helpers

function checkPowerOfTwo (value) {
  return ( value & ( value - 1 ) ) === 0 && value !== 0
}

function getNearestPowerOfTwo (n) {
  // next best power of two
  var l = Math.log(n) / Math.LN2;
  return Math.pow(2, Math.round(l))
}

function getCanvas(input, width, height) {
  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  var context = canvas.getContext('2d')
  // add filled white background, otherwise transparent png image areas turn black
  context.fillStyle="#FFFFFF";
  context.fillRect(0,0,width,height)
  context.drawImage(input, 0, 0, width, height)
  return canvas
}

// scales the canvas by (float) scale < 1
// returns a new canvas containing the scaled image.
function downScaleCanvas(cv, scale) {
  if (!(scale < 1) || !(scale > 0)) throw ('scale must be a positive number <1 ');
  scale = normaliseScale(scale);
  var tBuffer = new Float32Array(3 * cv.width * cv.height) // temporary buffer Float32 rgb
  var sqScale = scale * scale; // square scale =  area of a source pixel within target
  var sw = cv.width; // source image width
  var sh = cv.height; // source image height
  var tw = Math.floor(sw * scale); // target image width
  var th = Math.floor(sh * scale); // target image height
  var sx = 0, sy = 0, sIndex = 0; // source x,y, index within source array
  var tx = 0, ty = 0, yIndex = 0, tIndex = 0; // target x,y, x,y index within target array
  var tX = 0, tY = 0; // rounded tx, ty
  var w = 0, nw = 0, wx = 0, nwx = 0, wy = 0, nwy = 0; // weight / next weight x / y
  // weight is weight of current source point within target.
  // next weight is weight of current source point within next target's point.
  var crossX = false; // does scaled px cross its current px right border ?
  var crossY = false; // does scaled px cross its current px bottom border ?
  var sBuffer = cv.getContext('2d').getImageData(0, 0, sw, sh).data; // source buffer 8 bit rgba
  var sR = 0, sG = 0,  sB = 0; // source's current point r,g,b

  for (sy = 0; sy < sh; sy++) {
    ty = sy * scale; // y src position within target
    tY = 0 | ty;     // rounded : target pixel's y
    yIndex = 3 * tY * tw;  // line index within target array
    crossY = (tY !== (0 | ( ty + scale )));
    if (crossY) { // if pixel is crossing botton target pixel
      wy = (tY + 1 - ty); // weight of point within target pixel
      nwy = (ty + scale - tY - 1); // ... within y+1 target pixel
    }
    for (sx = 0; sx < sw; sx++, sIndex += 4) {
      tx = sx * scale; // x src position within target
      tX = 0 |  tx;    // rounded : target pixel's x
      tIndex = yIndex + tX * 3; // target pixel index within target array
      crossX = (tX !== (0 | (tx + scale)));
      if (crossX) { // if pixel is crossing target pixel's right
        wx = (tX + 1 - tx); // weight of point within target pixel
        nwx = (tx + scale - tX - 1); // ... within x+1 target pixel
      }
      sR = sBuffer[sIndex    ];   // retrieving r,g,b for curr src px.
      sG = sBuffer[sIndex + 1];
      sB = sBuffer[sIndex + 2];
      if (!crossX && !crossY) { // pixel does not cross
        // just add components weighted by squared scale.
        tBuffer[tIndex    ] += sR * sqScale;
        tBuffer[tIndex + 1] += sG * sqScale;
        tBuffer[tIndex + 2] += sB * sqScale;
      } else if (crossX && !crossY) { // cross on X only
        w = wx * scale;
        // add weighted component for current px
        tBuffer[tIndex    ] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // add weighted component for next (tX+1) px
        nw = nwx * scale
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
      } else if (!crossX && crossY) { // cross on Y only
        w = wy * scale;
        // add weighted component for current px
        tBuffer[tIndex    ] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // add weighted component for next (tY+1) px
        nw = nwy * scale
        tBuffer[tIndex + 3 * tw    ] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
      } else { // crosses both x and y : four target points involved
        // add weighted component for current px
        w = wx * wy;
        tBuffer[tIndex    ] += sR * w;
        tBuffer[tIndex + 1] += sG * w;
        tBuffer[tIndex + 2] += sB * w;
        // for tX + 1; tY px
        nw = nwx * wy;
        tBuffer[tIndex + 3] += sR * nw;
        tBuffer[tIndex + 4] += sG * nw;
        tBuffer[tIndex + 5] += sB * nw;
        // for tX ; tY + 1 px
        nw = wx * nwy;
        tBuffer[tIndex + 3 * tw    ] += sR * nw;
        tBuffer[tIndex + 3 * tw + 1] += sG * nw;
        tBuffer[tIndex + 3 * tw + 2] += sB * nw;
        // for tX + 1 ; tY +1 px
        nw = nwx * nwy;
        tBuffer[tIndex + 3 * tw + 3] += sR * nw;
        tBuffer[tIndex + 3 * tw + 4] += sG * nw;
        tBuffer[tIndex + 3 * tw + 5] += sB * nw;
      }
    } // end for sx
  } // end for sy

  // create result canvas
  var resCV = document.createElement('canvas');
  resCV.width = tw;
  resCV.height = th;
  var resCtx = resCV.getContext('2d');

//    var imgRes = resCtx.getImageData(resCV.width/2 - tw/2, resCV.height/2 - th/2, tw, th);
  var imgRes = resCtx.getImageData(0, 0, tw, th);
  var tByteBuffer = imgRes.data;
  // convert float32 array into a UInt8Clamped Array
  var pxIndex = 0; //
  for (sIndex = 0, tIndex = 0; pxIndex < tw * th; sIndex += 3, tIndex += 4, pxIndex++) {
    tByteBuffer[tIndex] = 0 | ( tBuffer[sIndex]);
    tByteBuffer[tIndex + 1] = 0 | (tBuffer[sIndex + 1]);
    tByteBuffer[tIndex + 2] = 0 | (tBuffer[sIndex + 2]);
    tByteBuffer[tIndex + 3] = 255;
    // set back temp buffer
    tBuffer[sIndex] = 0
    tBuffer[sIndex + 1] = 0
    tBuffer[sIndex + 2] = 0
  }

  // writing result to canvas.
  resCtx.putImageData(imgRes, 0, 0);
  return resCV;

}

function log2(v) {
  // taken from http://graphics.stanford.edu/~seander/bithacks.html
  var b =  [ 0x2, 0xC, 0xF0, 0xFF00, 0xFFFF0000 ];
  var S =  [1, 2, 4, 8, 16];
  var i=0, r=0;

  for (i = 4; i >= 0; i--) {
    if (v & b[i])  {
      v >>= S[i];
      r |= S[i];
    }
  }
  return r;
}

// normalize a scale <1 to avoid some rounding issue with js numbers
function normaliseScale(s) {
  if (s>1) throw('s must be <1');
  s = 0 | (1/s);
  var l = log2(s);
  var mask = 1 << l;
  var accuracy = 4;
  while(accuracy && l) { l--; mask |= 1<<l; accuracy--; }
  return 1 / ( s & mask );
}