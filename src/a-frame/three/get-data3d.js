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
    var sourceObject3d = object3d
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
    ;(function traverseThreeSceneGraph (threeObject3D) {

      threeObject3D.updateMatrixWorld()

      if (threeObject3D.geometry) {

        var threeGeometry = threeObject3D.geometry
        var threeMaterial = threeObject3D.material

        var data3dMesh = data3d.meshes[threeObject3D.uuid] = {}
        var data3dMaterial = data3d.materials[threeMaterial.uuid] = {}

        // translate geometry

        if (threeGeometry.type.indexOf('BufferGeometry') > -1) {
          if (threeGeometry.index) {
            translateIndexedBufferGeometry(data3dMesh, threeGeometry)
          } else {
            translateBufferGeometry(data3dMesh, threeGeometry)
          }
        } else {
          translateGeometry(data3dMesh, threeGeometry)
        }

        // translate scene graph

				var p = threeObject3D.getWorldPosition()
				var r = threeObject3D.getWorldRotation()
				var s = threeObject3D.getWorldScale()
        data3dMesh.position = [p.x, p.y, p.z]
        data3dMesh.rotRad = [r.x, r.y, r.z]
        data3dMesh.scale = [s.x, s.y, s.z]

        // translate material

        data3dMesh.material = threeMaterial.uuid
        
        translateNumbers([
          // three attribs -> data3d attribs
          ['opacity', 'opacity'],
          ['specularCoef', 'shininess'],
        ], threeMaterial, data3dMaterial)

        translateColors([
          // three attribs -> data3d attribs
          ['color', 'colorDiffuse'],
          ['specular', 'colorSpecular'],
          ['emissive', 'colorEmissive']
        ], threeMaterial, data3dMaterial)

        translateTextures([
            // three attribs -> data3d attribs
            ['map', 'mapDiffuse'],
            ['specularMap', 'mapSpecular'],
            ['normalMap', 'mapNormal'],
            ['alphaMap', 'mapAlpha']
          ], threeMaterial, data3dMaterial,
          basicTextureSetPromises, fullTextureSetPromises
        )

        // todo: use bake settings from data3dMaterial, i.e. lighting factor from emissive color?

      }

      // parse children
      threeObject3D.children.forEach(function(child){
        traverseThreeSceneGraph(child)
      })

    })(sourceObject3d);

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

function translateGeometry (data3dMesh, threeGeometry) {

  translateBufferGeometry(data3dMesh, new THREE.BufferGeometry().fromGeometry(threeGeometry))

}

function translateBufferGeometry(data3dMesh, threeGeometry) {

  if (!threeGeometry.attributes.position) return

  var attr = threeBufferGeometry.attributes
  if (attr.position) data3dMesh.positions = attr.position.array
  if (attr.normal) data3dMesh.normals = attr.normal.array
  if (attr.uv) data3dMesh.uvs = attr.uv.array

}

function translateIndexedBufferGeometry (data3dMesh, threeGeometry) {

  if (!threeGeometry.attributes.position) return

  var index = threeGeometry.index.array
  var i = 0, l = threeGeometry.index.array.length

  // translate positions
  var pIn = threeGeometry.attributes.position.array
  var pOut = new Float32Array(l * 3)
  for (i = 0; i < l; i++) {
    pOut[i * 3] = pIn[index[i] * 3]
    pOut[i * 3 + 1] = pIn[index[i] * 3 + 1]
    pOut[i * 3 + 2] = pIn[index[i] * 3 + 2]
  }
  data3dMesh.positions = pOut

  // translate normals
  if (threeGeometry.attributes.normal) {
    var nIn = threeGeometry.attributes.normal.array
    var nOut = new Float32Array(l * 3)
    for (i = 0; i < l; i++) {
      nOut[i * 3] = nIn[index[i] * 3]
      nOut[i * 3 + 1] = nIn[index[i] * 3 + 1]
      nOut[i * 3 + 2] = nIn[index[i] * 3 + 2]
    }
    data3dMesh.normals = nOut
  }

  // translate uvs
  if (threeGeometry.attributes.uv) {
    var uvIn = threeGeometry.attributes.uv.array
    var uvOut = new Float32Array(l * 2)
    for (i = 0; i < l; i++) {
      nOut[i * 2] = nIn[index[i] * 2]
      nOut[i * 2 + 1] = nIn[index[i] * 2 + 1]
    }
    data3dMesh.normals = nOut
  }

}

function translateNumbers(attribMap, threeMaterial, data3dMaterial) {

  attribMap.forEach(function(attribs){
    var threeName = attribs[0], data3dName = attribs[1]
    // translate material numeric values from three.js to data3d
    if (threeMaterial[threeName] !== undefined) data3dMaterial[data3dName] = threeMaterial[threeName]
  })

}

function translateColors(attribMap, threeMaterial, data3dMaterial) {

  attribMap.forEach(function(attribs){
    var threeName = attribs[0], data3dName = attribs[1]
    // translate material colors from three.js to data3d
    if (threeMaterial[threeName]) data3dMaterial[data3dName] = [
      threeMaterial[threeName].r, threeMaterial[threeName].g, threeMaterial[threeName].b
    ]
  })

}

function translateTextures(attribMap, threeMaterial, data3dMaterial, basicTextureSetPromises, fullTextureSetPromises) {

  attribMap.forEach(function(attribs){
    var threeName = attribs[0], data3dName = attribs[1]
    // translate textures from three.js to data3d

    // if not compressed get textures from threejs material:
    if (threeMaterial[threeName] && threeMaterial[threeName].image && !threeMaterial[threeName].isCompressedTexture) {
      basicTextureSetPromises.push(
        getTextureSet(threeMaterial[threeName].image).then(function (result) {

          // collect promises for full texture set
          fullTextureSetPromises.push(result.fullSetReady)

          // add texture keys to data3d
          data3dMaterial[data3dName] = result.dds
          data3dMaterial[data3dName+'Preview'] = result.loRes
          data3dMaterial[data3dName+'Source'] = result.source

        })
      )

      // fallback to data from data3dMaterial if available:
    } else if (threeMaterial.userData && threeMaterial.userData.data3dMaterial) {
      if (threeMaterial.userData.data3dMaterial[data3dName]) {
        data3dMaterial[data3dName] = threeMaterial.userData.data3dMaterial[data3dName]
        data3dMaterial[data3dName+'Source'] = threeMaterial.userData.data3dMaterial[data3dName+'Source']
        data3dMaterial[data3dName+'Preview'] = threeMaterial.userData.data3dMaterial[data3dName+'Preview']
      }
    }

  })

}