import Promise from 'bluebird'
import runtime from '../core/runtime.js'

export default function getData3dFromComponent (selector, options) {
  
  // API
  var options = options || {}
  var sourceEl = document.querySelector(selector || 'a-scene').object3D
  
  // internals
  var data3d = { meshes: {}, materials: {} }
  
  function traverse (el) {
    
    el.updateMatrixWorld()
    
    if (el.geometry) {
      
      // ensure buffer geometry in result
      var bufferGeometry = el.geometry.type === 'BufferGeometry' ? el.geometry : new THREE.BufferGeometry().fromGeometry(el.geometry)
      // TODO: add support for inteviewed buffers
      // TODO: add support for multimatrial objects
      
      var mesh = data3d.meshes[el.uuid] = {}
      var attr = bufferGeometry.attributes
      var p = el.getWorldPosition()
      var r = el.getWorldRotation()
      var s = el.getWorldScale()
      mesh.position = [p.x, p.y, p.z]
      mesh.rotation = [r.x, r.y, r.z]
      mesh.scale = [s.x, s.y, s.z]
      mesh.material = el.material.uuid
      if (attr.position) mesh.positions = attr.position.array
      if (attr.normal) mesh.normals = attr.normal.array
      if (attr.uvs) mesh.normals = attr.uv.array
      
      var m = el.material
      var material = data3d.materials[el.material.uuid] = {}
      material.color = [m.color.r, m.color.g, m.color.b]
      
    }
    
    // parse children
    el.children.forEach(function(child){
      traverse(child)
    })
    
  }
  
  traverse(sourceEl)
  
  return Promise.resolve(data3d)
  
}