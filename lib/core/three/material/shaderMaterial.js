import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default function ShaderMaterial () {
   return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: null },
      specularMap: { value: null },
      lightMap: { value: null },
      normalMap: { value: null },
      color: { value: new THREE.Color(1.0, 0.0, 0.0) },
      specular: { value: new THREE.Color(1.0, 0.0, 0.0) },
      opacity: { value: 1 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
   })
  }