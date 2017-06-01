const isNode = !!(
  // detect node environment
  typeof module !== 'undefined'
  && module.exports
  && typeof process !== 'undefined'
  && Object.prototype.toString.call(process) === '[object process]'
  && process.title.indexOf('node') !== -1
)
var isBrowser = typeof window !== 'undefined'

// webGl info
var webGl = isBrowser ? getWebGlInfo() : null

// create runtime object

var runtime = {

  isMobile: false,
  isNode: isNode,

  compatibility: {
    webglCompressedTextures: true
  }

}

export default runtime

// helpers

function getWebGlInfo () {

  var canvas = document.createElement('canvas')
  var gl = canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl') ||
    canvas.getContext('webgl', {antialias: false}) ||
    canvas.getContext('experimental-webgl', {antialias: false})

  var glParamKeys = [
    'SHADING_LANGUAGE_VERSION',
    'VENDOR',
    'RENDERER',
    'MAX_TEXTURE_SIZE',
    'MAX_CUBE_MAP_TEXTURE_SIZE',
    'MAX_TEXTURE_IMAGE_UNITS',
    'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
    'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
    'MAX_FRAGMENT_UNIFORM_VECTORS',
    'MAX_VERTEX_UNIFORM_VECTORS',
    'MAX_VARYING_VECTORS',
    'MAX_RENDERBUFFER_SIZE',
    'MAX_VERTEX_ATTRIBS'
    //'MAX_VIEWPORT_DIMS'
  ]
  var glParams = {}
  for (var i = 0, l = glParams.length; i < l; i++) {
    glParams[ glParamKeys[ i ] ] = gl.getParameter(gl[ glParamKeys[ i ] ])
  }

// extensions (inspired by jussi-kalliokoski)
  var glExtensions = gl.getSupportedExtensions()

// compressed textures
// if (gl.getExtension('WEBGL_compressed_texture_s3tc')) {
//   has.webglCompressedTextures = true
// }

// GPU name
// if (gl.getExtension('WEBGL_debug_renderer_info')) {
//   window.env.gpu.name = gl.getParameter(37446)
// }

  return {
    params: glParams,
    extensions: glExtensions
  }

}