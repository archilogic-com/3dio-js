import fragmentShader from './base-fragment.glsl'
import vertexShader from './base-vertex.glsl'

export default function BaseMaterial () {
  var customUniforms = {
    diffuse: { value: new THREE.Color(1.0, 1.0, 1.0) },
    map: { value: null },
    specularMap: { value: null },
    alphaMap: { value: null },
    lightMap: { value: null },
    lightMapIntensity: { value: 1.0 },
    lightMapFalloff: { value: 0.5 },
    lightMapCenter: { value: 0.5 },
    normalMap: { value: null },
    shininess: { value: 1.0 },
    specular: { value: new THREE.Color(0.0, 0.0, 0.0) },
    opacity: { value: 1 },
    offsetRepeat: { value: new THREE.Vector4( 0, 0, 1, 1) }
  }
  var uniforms = THREE.UniformsUtils.merge( [
    THREE.UniformsLib[ "lights" ],
    customUniforms
    ] )
  return new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    lights: true
  })
}