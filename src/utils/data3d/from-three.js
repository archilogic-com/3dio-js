import Promise from 'bluebird'
import consolidateData3d from './consolidate.js'
import generateTextureSet from './generate-texture-set.js'
import checkDependencies from '../../a-frame/check-dependencies.js'
import runtime from '../../core/runtime.js'

// main

export default checkDependencies({
  three: true,
  aframe: false
}, function () {

  return function getData3d(object3d) {

    // API
    var sourceObject3d = object3d

    // returns data3d when a minimal texture is ready:
    // - source textures for server side processing
    // - loRes textures for rendering
    var texturePromises = []

    // internals
    var data3d = { meshes: {}, materials: {} }

    // traverse scene graph
    ;(function traverseThreeSceneGraph (threeObject3D) {

      threeObject3D.updateMatrixWorld()

      if (threeObject3D.geometry) {

        var threeGeometry = threeObject3D.geometry

        // ensure buffer geometry
        if (threeGeometry.type.indexOf('BufferGeometry') === -1) {
          threeGeometry = new THREE.BufferGeometry().fromGeometry(threeGeometry)
        }

        if (threeGeometry.index) {
          if (threeGeometry.attributes.colors) {
            translateIndexedBufferGeometryWithColor(data3d, threeObject3D, texturePromises)
          } else {
            translateIndexedBufferGeometry(data3d, threeObject3D, texturePromises)
          }
        } else {
          translateNonIndexedBufferGeometry(data3d, threeObject3D, texturePromises)
        }

      }

      // parse children
      threeObject3D.children.forEach(function(child){
        traverseThreeSceneGraph(child)
      })

    })(sourceObject3d);

    return Promise.all([
      consolidateData3d(data3d),
      Promise.all(texturePromises)
    ]).then(function(results){
      // return data3d
      return results[0]
    })

  }
})

// helpers

function translateSceneGraph (data3dMesh, threeObject3D) {
  var p = threeObject3D.getWorldPosition()
  var r = threeObject3D.getWorldRotation()
  var s = threeObject3D.getWorldScale()
  data3dMesh.position = [p.x, p.y, p.z]
  data3dMesh.rotRad = [r.x, r.y, r.z]
  data3dMesh.scale = [s.x, s.y, s.z]
}


function translateNonIndexedBufferGeometry (data3d, threeObject3D, texturePromises) {

  // mesh
  var threeGeometry = threeObject3D.geometry
  // create data3d mesh
  var data3dMesh = data3d.meshes[threeObject3D.uuid] = {}
  // positions
  data3dMesh.positions = threeGeometry.attributes.position.array
  // normals
  if (threeGeometry.attributes.normal) data3dMesh.normals = threeGeometry.attributes.normal.array
  // uvs
  if (threeGeometry.attributes.uv) data3dMesh.uvs = threeGeometry.attributes.uv.array

  // material
  translateMaterial(data3d, data3dMesh, threeObject3D, threeObject3D.material, texturePromises)

  // scene graph
  translateSceneGraph(data3dMesh, threeObject3D)

}

function translateIndexedBufferGeometry (data3d, threeObject3D, texturePromises) {

  var threeGeometry = threeObject3D.geometry
  // create data3d mesh
  var data3dMesh = data3d.meshes[threeObject3D.uuid] = {}

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

  // material
  var threeMaterial = threeObject3D.material
  translateMaterial(data3d, data3dMesh, threeObject3D, threeObject3D.material, texturePromises)

  // scene graph
  translateSceneGraph(data3dMesh, threeObject3D)

}

function translateIndexedBufferGeometryWithColor (data3d, threeObject3D, texturePromises) {

  console.log(threeObject3D)
  // TODO: add support for vertex colors:
  // 1. create material indices
  // 2. create separate data3d meshes
  // 3. create separate data3d materials
  // 4. replace this placeholder function:
  translateIndexedBufferGeometry (data3d, threeObject3D, texturePromises)

}

function translateMaterial (data3d, data3dMesh, threeObject3D, threeMaterial, texturePromises) {

  // create data3d material
  var data3dMaterial = data3d.materials[threeMaterial.uuid] = {}
  // link data3d mesh with material
  data3dMesh.material = threeMaterial.uuid

  // material attributes

  translateMaterialNumericValues([
    // three attribs -> data3d attribs
    ['opacity', 'opacity'],
    ['specularCoef', 'shininess'],
  ], threeMaterial, data3dMaterial)

  translateMaterialColors([
    // three attribs -> data3d attribs
    ['color', 'colorDiffuse'],
    ['specular', 'colorSpecular'],
    ['emissive', 'colorEmissive']
  ], threeMaterial, data3dMaterial)

  translateMaterialTextures([
    // three attribs -> data3d attribs
    ['map', 'mapDiffuse'],
    ['specularMap', 'mapSpecular'],
    ['normalMap', 'mapNormal'],
    ['alphaMap', 'mapAlpha']
  ], threeMaterial, data3dMaterial, texturePromises)

}

function translateMaterialNumericValues(attribMap, threeMaterial, data3dMaterial) {

  attribMap.forEach(function(attribs){
    var threeName = attribs[0], data3dName = attribs[1]
    // translate material numeric values from three.js to data3d
    if (threeMaterial[threeName] !== undefined) data3dMaterial[data3dName] = threeMaterial[threeName]
  })

}

function translateMaterialColors(attribMap, threeMaterial, data3dMaterial) {

  attribMap.forEach(function(attribs){
    var threeName = attribs[0], data3dName = attribs[1]
    // translate material colors from three.js to data3d
    if (threeMaterial[threeName]) data3dMaterial[data3dName] = [
      threeMaterial[threeName].r, threeMaterial[threeName].g, threeMaterial[threeName].b
    ]
  })

}

function translateMaterialTextures(attribMap, threeMaterial, data3dMaterial, texturePromises) {

  attribMap.forEach(function(attribs){
    // translate texture from three.js to data3d
    var threeAttribName = attribs[0]
    var data3dAttribName = attribs[1]

    // if not compressed get textures from threejs material:
    var isNonCompressedImage = threeMaterial[threeAttribName] && threeMaterial[threeAttribName].image && !threeMaterial[threeAttribName].isCompressedTexture
    if (isNonCompressedImage) {

      var image = threeMaterial[threeName].image
      texturePromises.push(
        generateTextureSet(image).then(function (result) {
          // add texture keys to data3d
          data3dMaterial[data3dName + 'Preview'] = result.loRes
          data3dMaterial[data3dName + 'Source'] = result.source
          data3dMaterial[data3dName] = result.dds
        })
      )

    } else {
      // fallback to data from data3dMaterial (if available)
      var hasOriginalData3dMaterial = threeMaterial.userData && threeMaterial.userData.data3dMaterial && threeMaterial.userData.data3dMaterial[data3dAttribName]
      if (hasOriginalData3dMaterial) {
        var originalData3dMaterial = threeMaterial.userData.data3dMaterial
        data3dMaterial[data3dAttribName+'Preview'] = originalData3dMaterial[data3dAttribName+'Preview']
        data3dMaterial[data3dAttribName+'Source'] = originalData3dMaterial[data3dAttribName+'Source']
        data3dMaterial[data3dAttribName] = originalData3dMaterial[data3dAttribName]
      }
    }

  })

}