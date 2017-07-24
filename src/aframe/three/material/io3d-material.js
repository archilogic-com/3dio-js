import checkDependencies from '../../check-dependencies.js'
import fragmentShader from './io3d-fragment.glsl'
import vertexShader from './io3d-vertex.glsl'

// CONFIGS

var DEFAULT_LIGHT_MAP_INTENSITY = 1
var DEFAULT_LIGHT_MAP_CENTER = 0.5
var DEFAULT_LIGHT_MAP_FALLOFF = 0

export default checkDependencies ({
  three: true,
  aframe: false
}, function makeBaseMaterial () {

  function BaseMaterial( params ) {
    THREE.ShaderMaterial.call( this, params )

    var params = params || {}
    this.lightMapCenter = params.lightMapCenter || DEFAULT_LIGHT_MAP_CENTER
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
        lightMapCenter: { value: params.lightMapCenter || DEFAULT_LIGHT_MAP_CENTER },
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

  BaseMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype)
  BaseMaterial.prototype.constructor = BaseMaterial

  return BaseMaterial

})