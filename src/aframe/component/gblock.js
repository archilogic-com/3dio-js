// TODO: Replace placeholder shaders by original ones (requires fixing projection matrix)
import Promise from 'bluebird'
import decodeArrayToString from '../../utils/array/decode-to-string.js'
import fetchScript from '../../utils/io/fetch-script.js'
import PromiseCache from '../../utils/promise-cache.js'
import fragmentShader from './gblock/fragment-placeholder.glsl'
import vertexShader from './gblock/vertex-placeholder.glsl'

// configs

var LEGACY_GLFT_V1_LOADER_URL = 'https://cdn.rawgit.com/mrdoob/three.js/r86/examples/js/loaders/GLTFLoader.js'
var GBLOCK_API_GET_OFFICIAL_GLTF_URL = 'https://gblock.3d.io/api/get-gltf-url/?url='

// internals

var promiseCache = new PromiseCache()

// aframe module

export default {

  schema: {type: 'asset'},

  init: function () {

    this.model = null

  },

  update: function () {

    var self = this
    var el = this.el
    var src = this.data

    if (!src) { return; }

    this.remove()

    getGltfUrl(src).then(loadGblockModel).then(function onLoaded (gltfModel) {

      self.model = gltfModel.scene || gltfModel.scenes[0]
      self.model.animations = gltfModel.animations

      el.setObject3D('mesh', self.model)
      el.emit('model-loaded', {format: 'gltf', model: self.model})

    }).catch(function(errorMessage){

      console.error('ERROR loading gblock model from "' + src +'" : ' + errorMessage)
      el.emit('model-error', { message: errorMessage })

    })

  },

  remove: function () {

    if (!this.model) { return; }
    this.el.removeObject3D('mesh')

  }

}

// private shared methods

// FIXME: Replace this with an official API URL once available
// This API call is only needed to obtain the official glTF URL of a google block model.
// The glTF itself is not being proxied and gets fetched from https://vr.google.com/downloads/* directly.
// https://github.com/archilogic-com/aframe-gblock/issues/1
// API server code: server/index.js
// try promise cache (could be in loading state)
function getGltfUrl (src) {

  // try cache
  var getUrlPromise = promiseCache.get(src)

  if (!getUrlPromise) {

    getUrlPromise = fetch(GBLOCK_API_GET_OFFICIAL_GLTF_URL + src).then(function (response) {

      // parse response
      return response.json().catch(function(error){
        // handle JSON parsing error
        console.log('ERROR parsing gblock API server response JSON.\nRequested Model: "' + src + '"\nError: "' + JSON.stringify(error) + '"')
        return Promise.reject('gblock API server error. Check console for details.')
      }).then(function (message) {
        if (response.ok) {
          // return glTF URL
          return message.gltfUrl
        } else {
          // handle error response
          console.error('ERROR loading gblock model "'+ src +'" : ' + response.status + ' "' + message.message)
          return Promise.reject(message.message)
        }
      })

    })

    // add to cache
    promiseCache.add(src, getUrlPromise)

  }

  return getUrlPromise

}

// loads google block models (poly.google.com)
function loadGblockModel(url, onProgress) {
  return new Promise(function(resolve, reject) {

    // create unviresal GLTF loader for google blocks
    // this one will inherit methods from GLTF V1 or V2 based on file version
    function GBlockLoader () {
      this.manager = THREE.DefaultLoadingManager
      this.path = THREE.Loader.prototype.extractUrlBase( url )
    }

    // load model
    var loader = new THREE.FileLoader( GBlockLoader.manager )
    loader.setResponseType( 'arraybuffer' )
    loader.load( url, function onLoad( data ) {
      try {

        // convert uint8 to json
        var json = JSON.parse(decodeArrayToString.utf8(data))

        // check GLTF version
        var isGLTF1 = json.asset === undefined || json.asset.version[ 0 ] < 2

        if (isGLTF1) {

          fetchGLTF1Loader().then(function(GLTF1Loader){

            // inherit methods from GLTF V1 loader
            GBlockLoader.prototype = GLTF1Loader.prototype
            var gblockLoader = new GBlockLoader()
            GLTF1Loader.call(gblockLoader)

            // Replace original shaders with placeholders
            Object.keys(json.shaders).forEach(function (key, i) {
              if (key.indexOf('fragment') > -1) json.shaders[key].uri = fragmentShader.base64
              else if (key.indexOf('vertex') > -1) json.shaders[key].uri = vertexShader.base64
            })

            // convert json back to uint8 data
            var modifiedData = new TextEncoder('utf-8').encode(JSON.stringify(json))

            // parse data
            gblockLoader.parse( modifiedData, function onParsingDone (gltf) {

              // FIXME: adapt projection matrix in original shaders and do not replace materials
              (gltf.scene || gltf.scenes[0]).traverse(function (child) {
                if (child.material) child.material = new THREE.MeshPhongMaterial({ vertexColors: THREE.VertexColors })
              })

              // GLTF V1 ready
              resolve(gltf)

            }, gblockLoader.path)

          })

        } else {

          // inferit methods from GLTF V2 loader
          GBlockLoader.prototype = THREE.GLTFLoader.prototype
          var gblockLoader = new GBlockLoader()
          THREE.GLTFLoader.call(gblockLoader)

          // parse data
          gblockLoader.parse( data, gblockLoader.path, resolve, reject)

        }

      } catch ( e ) {

        // For SyntaxError or TypeError, return a generic failure message.
        reject( e.constructor === Error ? e : new Error( 'THREE.GLTFLoader: Unable to parse model.' ) )

      }

    }, onProgress, reject )

  })
}

// fetch legacy GLTF v1 loader on demand
var GLFT1LoaderPromise
function fetchGLTF1Loader () {
  if (!GLFT1LoaderPromise ) {
    // legacy loader will overwrite THREE.GLTFLoader so we need to keep reference to it
    THREE.___GLTF2Loader = THREE.GLTFLoader
    // fetch legacy loader for GLTF1
    GLFT1LoaderPromise = fetchScript(LEGACY_GLFT_V1_LOADER_URL).then(function(){
      // keep reference GLTF V1 loader
      var GLTF1Loader = THREE.GLTFLoader
      // restore GLTF V2 loader reference
      THREE.GLTFLoader = THREE.___GLTF2Loader

      return GLTF1Loader
    })
  }
  return GLFT1LoaderPromise
}