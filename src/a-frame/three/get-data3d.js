import Promise from 'bluebird'
import consolidateData3d from '../../utils/data3d/consolidate.js'
import checkDependencies from '../check-dependencies.js'
import runtime from '../../core/runtime.js'

// constants

export default checkDependencies({
  three: true,
  aframe: false
}, function () {

  return function getData3d(object3d) {

    // API
    var options = options || {}
    var sourceEl = object3d

    // internals
    var data3d = { meshes: {}, materials: {} }

    function traverse (el) {
      
      el.updateMatrixWorld()

      if (el.geometry) {
        
        // ensure buffer geometry in result
        var bufferGeometry = el.geometry.type.indexOf('BufferGeometry') > -1 ? el.geometry : new THREE.BufferGeometry().fromGeometry(el.geometry)
        // TODO: add support for inteviewed buffers
        // TODO: add support for multimatrial objects
        
        var mesh = data3d.meshes[el.uuid] = {}
        var attr = bufferGeometry.attributes
        var p = el.getWorldPosition()
        var r = el.getWorldRotation()
        var s = el.getWorldScale()
        mesh.position = [p.x, p.y, p.z]
        mesh.rotRad = [r.x, r.y, r.z]
        mesh.scale = [s.x, s.y, s.z]
        mesh.material = el.material.uuid
        if (attr.position) mesh.positions = attr.position.array
        if (attr.normal) mesh.normals = attr.normal.array
        if (attr.uv) mesh.uvs = attr.uv.array
        
        var m = el.material
        var material = data3d.materials[el.material.uuid] = {}
        if (m.color) material.colorDiffuse = [m.color.r, m.color.g, m.color.b]

      }

      // parse children
      el.children.forEach(function(child){
        traverse(child)
      })

    }

    traverse(sourceEl)

    return Promise.resolve().then(function(){
      return consolidateData3d(data3d)
    })

  }
})