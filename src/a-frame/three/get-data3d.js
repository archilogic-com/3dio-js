import Promise from 'bluebird'
import consolidateData3d from '../../utils/data3d/consolidate.js'
import getTextureSet from '../../utils/data3d/get-texture-set.js'
import checkDependencies from '../check-dependencies.js'
import runtime from '../../core/runtime.js'

// constants

export default checkDependencies({
  three: true,
  aframe: false
}, function () {

  return function getData3d(object3d, options) {

    // API
    var sourceEl = object3d
		var options = options || {}
		var onFullTextureSetReady = options.onFullTextureSetReady

    // internals
    var data3d = { meshes: {}, materials: {} }

    // promises for a minimal texture set required to proceed
    // - source textures for server side processing
    // - preview textures for minimal view
    var basicTextureSetPromises = []

    // promises for full texture set
    // - DXT (DDS) for hires on desktop
    // - PVRTC for iOS (not yet implemented)
    // - ETC1 for Android (not yet implemented)
    var fullTextureSetPromises = []

    // traverse scene graph
    ;(function traverse (el) {
      
      el.updateMatrixWorld()

      if (el.geometry) {

				// ensure buffer geometry in result
				var bufferGeometry = el.geometry.type.indexOf('BufferGeometry') > -1 ? el.geometry : new THREE.BufferGeometry().fromGeometry(el.geometry)

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

        var threeMaterial = el.material
        var data3dMaterial = data3d.materials[el.material.uuid] = {}

        convertColor(threeMaterial, 'color', data3dMaterial, 'colorDiffuse')
        convertMap(threeMaterial, 'map', data3dMaterial, 'mapDiffuse', basicTextureSetPromises, fullTextureSetPromises)

      }

      // parse children
      el.children.forEach(function(child){
        traverse(child)
      })

    })(sourceEl);

    return Promise.all(basicTextureSetPromises).then(function(){
      // trigger callback when full texture set promises finish
      Promise.all(fullTextureSetPromises).then(function(){
        if (onFullTextureSetReady) onFullTextureSetReady()
      })
      // return data3d
      return consolidateData3d(data3d)
    })

  }
})

// helpers

function convertColor(threeMaterial, threeName, data3dMaterial, data3dName) {
  // get colors always from threejs mat
  if (threeMaterial[threeName]) data3dMaterial.data3dName = [
    threeMaterial[threeName].r, threeMaterial[threeName].g, threeMaterial[threeName].b
  ]
}

function convertMap(threeMaterial, threeName, data3dMaterial, data3dName, basicTextureSetPromises, fullTextureSetPromises) {
  // get textures from threejs mat if not compressed with fallback to data3dMaterial source
  if (threeMaterial[threeName] && threeMaterial[threeName].image && !threeMaterial[threeName].isCompressedTexture) {
    basicTextureSetPromises.push(
      getTextureSet(m.map.image).then(function (result) {
        fullTextureSetPromises.push(result.fullSetReady)
        material.mapDiffuse = result.dds
        material.mapDiffusePreview = result.loRes
        material.mapDiffuseSource = result.source
      })
    )
  } else if (threeMaterial.userData && threeMaterial.userData.data3dMaterial) {
    if (threeMaterial.userData.data3dMaterial[data3dName]) {
      data3dMaterial[data3dName] = threeMaterial.userData.data3dMaterial[data3dName]
    }
  }
}