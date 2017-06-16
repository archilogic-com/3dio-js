import fragmentShader from './base-fragment.glsl'
import vertexShader from './base-vertex.glsl'

export default function BaseMaterial () {
  return new THREE.ShaderMaterial({
    name: "BaseShader",
    //defines: defines,
    uniforms: {
      diffuse: { value: new THREE.Color(1.0, 1.0, 1.0) },
      map: { value: null },
      specularMap: { value: null },
      lightMap: { value: null },
      normalMap: { value: null },
      shininess: { value: 1.0 },
      specular: { value: new THREE.Color(0.0, 0.0, 0.0) },
      opacity: { value: 1 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
}