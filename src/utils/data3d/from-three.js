import Promise from 'bluebird'
import normalizeData3d from './normalize.js'
import generateTextureSet from './generate-texture-set.js'
import checkDependencies from '../../a-frame/check-dependencies.js'
import runtime from '../../core/runtime.js'

// main

export default checkDependencies({
  three: true,
  aframe: false
}, function () {

  return function getData3dFromThreeJs(object3d) {
    
    // returns data3d when a minimal texture is ready:
    // - source textures for server side processing
    // - loRes textures for rendering
    var texturePromises = []

    // internals

    var data3d = { meshes: {}, materials: {} }
    var meshCounter = 0
    var materialCounter = 0

    // private methods

    function getMeshId () {
      meshCounter++
      return 'mesh_' + meshCounter
    }

    function getMaterialId () {
      materialCounter++
      return 'material_' + materialCounter
    }

    // traverse scene graph

    ;(function traverseThreeSceneGraph (threeObject3D) {

      threeObject3D.updateMatrixWorld()

      if (threeObject3D.geometry) {

        var threeGeometry = threeObject3D.geometry

        // ensure buffer geometry
        if (threeGeometry.type.indexOf('BufferGeometry') === -1) {
          threeGeometry = new THREE.BufferGeometry().fromGeometry(threeGeometry)
        }

        // translate only geometries with faces
        if (threeGeometry.attributes.position.array.length) {

          if (threeGeometry.index) {
            if (threeGeometry.attributes.color) {
              translateIndexedBufferGeometryWithColor(data3d, threeObject3D, getMeshId, getMaterialId)
            } else {
              translateIndexedBufferGeometry(data3d, threeObject3D, getMeshId, getMaterialId, texturePromises)
            }
          } else {
            translateNonIndexedBufferGeometry(data3d, threeObject3D, getMeshId, getMaterialId, texturePromises)
          }

        }

      }

      // parse children
      threeObject3D.children.forEach(function(child){
        traverseThreeSceneGraph(child)
      })

    })(object3d);

    return Promise.all([
      normalizeData3d(data3d),
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


function translateNonIndexedBufferGeometry (data3d, threeObject3D, getMeshId, getMaterialId, texturePromises) {

  // mesh
  var threeGeometry = threeObject3D.geometry
  // create data3d mesh
  var data3dMesh = data3d.meshes[getMeshId()] = {}
  // positions
  data3dMesh.positions = threeGeometry.attributes.position.array
  // normals
  if (threeGeometry.attributes.normal) data3dMesh.normals = threeGeometry.attributes.normal.array
  // uvs
  if (threeGeometry.attributes.uv) data3dMesh.uvs = threeGeometry.attributes.uv.array

  // material
  translateMaterial(data3d, data3dMesh, threeObject3D, threeObject3D.material, getMaterialId, texturePromises)

  // scene graph
  translateSceneGraph(data3dMesh, threeObject3D)

}

function translateIndexedBufferGeometry (data3d, threeObject3D, getMeshId, getMaterialId, texturePromises) {

  var threeGeometry = threeObject3D.geometry
  // create data3d mesh
  var data3dMesh = data3d.meshes[getMeshId()] = {}

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
  translateMaterial(data3d, data3dMesh, threeObject3D, threeObject3D.material, getMaterialId, texturePromises)

  // scene graph
  translateSceneGraph(data3dMesh, threeObject3D)

}

function translateIndexedBufferGeometryWithColor (data3d, threeObject3D, getMeshId, getMaterialId) {

  var colorMap = {}

  var threeGeometry = threeObject3D.geometry

  var index = threeGeometry.index.array
  var colors = threeGeometry.attributes.color.array
  var colorSize = threeGeometry.attributes.color.itemSize
  var defaultOpacity = colorSize === 3 ? 1 : null // null because we will extract opacity from color array while parsing it
  var i = 0, l = threeGeometry.index.array.length, materialId

  var color, colorKey, opacity
  // build color map & create materials (loop over index face by face)
  for (i = 0; i < l; i+=3) {
    // get color of first vertex
    color = [colors[index[i] * colorSize], colors[index[i] * colorSize + 1], colors[index[i] * colorSize + 2]]
    opacity = defaultOpacity || colors[index[i] * colorSize + 3]
    colorKey = color.join('-') + '-' + opacity

    // .itemSize of faces
    if (colorMap[colorKey]) {
      colorMap[colorKey].faceCount++
    } else {
      materialId = getMaterialId()
      colorMap[colorKey] = {
        faceCount: 1,
        materialId: materialId
      }
      // create material
      data3d.materials[ materialId ] = {
        colorDiffuse: color,
        opacity: opacity
      }
    }
  }

  // create arrays & meshes
  Object.keys(colorMap).forEach(function(key, i){
    // create arrays
    colorMap[key].positions = new Float32Array(colorMap[key].faceCount * 9)
    colorMap[key].positionIndex = 0
    if (threeGeometry.attributes.normal) {
      colorMap[key].normals = new Float32Array(colorMap[key].faceCount * 9)
      colorMap[key].normalIndex = 0
    }
    // create data3d mesh
    var meshId = getMeshId()
    var data3dMesh = data3d.meshes[meshId] = {
      positions: colorMap[key].positions,
      normals: colorMap[key].normals,
      material: colorMap[key].materialId
    }
    // scene graph
    translateSceneGraph(data3dMesh, threeObject3D)
  })
  
  // fill arrays: translate positions and normals (loop over index face by face)
  var pOut, pOutI, pIn = threeGeometry.attributes.position.array,
    nOut, nOutI, nIn = threeGeometry.attributes.normal.array
  for (i = 0; i < l; i+=3) {
    // get color of this face (use first vertex)
    color = [colors[index[i] * colorSize], colors[index[i] * colorSize + 1], colors[index[i] * colorSize + 2]]
    opacity = defaultOpacity || colors[index[i] * colorSize + 3]
    colorKey = color.join('-') + '-' + opacity

    // get output array for positions
    pOut = colorMap[colorKey].positions
    pOutI = colorMap[colorKey].positionIndex
    // vertex 1
    pOut[pOutI]     = pIn[index[i] * 3]
    pOut[pOutI + 1] = pIn[index[i] * 3 + 1]
    pOut[pOutI + 2] = pIn[index[i] * 3 + 2]
    // vertex 1
    pOut[pOutI + 3] = pIn[index[i + 1] * 3]
    pOut[pOutI + 4] = pIn[index[i + 1] * 3 + 1]
    pOut[pOutI + 5] = pIn[index[i + 1] * 3 + 2]
    // vertex 1
    pOut[pOutI + 6] = pIn[index[i + 2] * 3]
    pOut[pOutI + 7] = pIn[index[i + 2] * 3 + 1]
    pOut[pOutI + 8] = pIn[index[i + 2] * 3 + 2]
    // move index
    colorMap[colorKey].positionIndex += 9

    // get output array for normals
    if (nIn) {
      nOut = colorMap[colorKey].normals
      nOutI = colorMap[colorKey].normalIndex
      // vertex 1
      nOut[nOutI]     = nIn[index[i] * 3]
      nOut[nOutI + 1] = nIn[index[i] * 3 + 1]
      nOut[nOutI + 2] = nIn[index[i] * 3 + 2]
      // vertex 1
      nOut[nOutI + 3] = nIn[index[i + 1] * 3]
      nOut[nOutI + 4] = nIn[index[i + 1] * 3 + 1]
      nOut[nOutI + 5] = nIn[index[i + 1] * 3 + 2]
      // vertex 1
      nOut[nOutI + 6] = nIn[index[i + 2] * 3]
      nOut[nOutI + 7] = nIn[index[i + 2] * 3 + 1]
      nOut[nOutI + 8] = nIn[index[i + 2] * 3 + 2]
      // move index
      colorMap[colorKey].normalIndex += 9
    }

  }

  return data3d

}

function translateMaterial (data3d, data3dMesh, threeObject3D, threeMaterial, getMaterialId, texturePromises) {

  var materialId = getMaterialId()
  // create data3d material
  var data3dMaterial = data3d.materials[materialId] = {}
  // link data3d mesh with material
  data3dMesh.material = materialId

  // material attributes

  translateMaterialNumericValues([
    // three attribs -> data3d attribs
    ['opacity', 'opacity'],
    ['shininess', 'specularCoef']
  ], threeMaterial, data3dMaterial)

  translateMaterialNormalScale(threeMaterial, data3dMaterial)

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

function translateMaterialNormalScale(threeMaterial, data3dMaterial) {

  if (threeMaterial.normalScale) data3dMaterial.mapNormalFactor = threeMaterial.normalScale.x

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