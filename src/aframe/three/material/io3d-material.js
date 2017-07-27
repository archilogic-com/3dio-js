import checkDependencies from '../../check-dependencies.js'
import fragmentShader from './io3d-fragment.glsl'
import vertexShader from './io3d-vertex.glsl'

// CONFIGS

var DEFAULT_LIGHT_MAP_INTENSITY = 1
var DEFAULT_LIGHT_MAP_EXPOSURE = 0.5
var DEFAULT_LIGHT_MAP_FALLOFF = 0

export default checkDependencies ({
  three: true,
  aframe: false
}, function makeIo3dMaterial () {

  function Io3dMaterial( params ) {
    THREE.ShaderMaterial.call( this, params )

    var params = params || {}
    this.lightMapExposure = params.lightMapExposure || DEFAULT_LIGHT_MAP_EXPOSURE
    this.lightMapFalloff = params.lightMapFalloff || DEFAULT_LIGHT_MAP_FALLOFF

    this.uniforms = THREE.UniformsUtils.merge( [
      THREE.UniformsLib[ "lights" ],
      THREE.UniformsLib[ "shadowmap" ],
      { diffuse: { value: params.diffuse || new THREE.Color(1.0, 1.0, 1.0) },
        map: { value: params.map || null },
        specularMap: { value: params.specularMap || null },
        alphaMap: { value: params.alphaMap || null },
        lightMap: { value: params.lightMap || null },
        lightMapIntensity: { value: params.lightMapIntensity || DEFAULT_LIGHT_MAP_INTENSITY },
        lightMapFalloff: { value: params.lightMapFalloff || DEFAULT_LIGHT_MAP_FALLOFF },
        lightMapExposure: { value: params.lightMapExposure || DEFAULT_LIGHT_MAP_EXPOSURE },
        normalMap: { value: params.normalMap || null },
        shininess: { value: params.shininess || 1.0 },
        specular: { value: params.specular || new THREE.Color(0.25, 0.25, 0.25) },
        emissive: { value: params.emissive || new THREE.Color(0.0, 0.0, 0.0) },
        opacity: { value: params.opacity || 1 },
        offsetRepeat: { value: params.offsetRepeat || new THREE.Vector4( 0, 0, 1, 1) }
      }
    ])

    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader
    this.lights = true
  }

  Io3dMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype)
  Io3dMaterial.prototype.constructor = Io3dMaterial

  return Io3dMaterial

})