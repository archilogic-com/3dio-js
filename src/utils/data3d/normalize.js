import traverseData3d from './traverse.js'
import cloneData3d from './clone.js'
import uuid from '../uuid.js'
import shortId from '../short-id.js'
import hexToRgb from '../color/hex-to-rgb.js'
import generateUvs from './buffer/get-uvs.js'
import generateNormals from './buffer/get-normals.js'

// placeholder
function normalizeMaterials(x) { return x; }

// API

var consolidate = consolidateData3d
consolidate.meshes = consolidateMeshes
consolidate.materials = consolidateMaterials

export default consolidate

// constants

var IS_DEBUG_MODE = true
var DEG_TO_RAD = Math.PI / 180
var RAD_TO_DEG = 180 / Math.PI

// main
function consolidateData3d(data3d, options){

  // API
  options = options || {}
  var consolidateMaterialsEnabled = options.consolidateMaterials !== undefined ? options.consolidateMaterials : true
  var consolidateMeshesEnabled = options.consolidateMeshes !== undefined ? options.consolidateMeshes : true
  var el3d = options.el3d
  var warningCallback = options.onWarning

  // make clone so that we can apply changes
  data3d = cloneData3d(data3d)

  // support hierarchy
  var resolvePromises = []
  traverseData3d(data3d, function(data3d){

    // add node id
    data3d.nodeId = el3d ? el3d.params.id : uuid.generate()

    // add keys to data3d if not present
    data3d.meshes = data3d.meshes || {}
    data3d.meshKeys = data3d.meshKeys || Object.keys(data3d.meshes)
    data3d.materials = data3d.materials || {}
    data3d.materialKeys = data3d.materialKeys || Object.keys(data3d.materials)

    // add params
    if (el3d && !data3d._params) {
      data3d._params = el3d.toObject({ recursive: false })
    }

    // add position
    if (!data3d.position) {
      if (el3d) {
        data3d.position = [ el3d.params.x || 0, el3d.params.y || 0, el3d.params.z || 0 ]
      } else {
        data3d.position = [ 0, 0, 0 ]
      }
    }

    // add rotation
    if (!data3d.rotRad && !data3d.rotDeg) {
      // both missing
      if (el3d) {
        data3d.rotDeg = [ el3d.params.rx || 0, el3d.params.ry || 0, el3d.params.rz || 0 ]
      } else {
        data3d.rotDeg = [ 0, 0, 0 ]
      }
      data3d.rotRad = [ data3d.rotDeg[0] * DEG_TO_RAD, data3d.rotDeg[1] * DEG_TO_RAD, data3d.rotDeg[2] * DEG_TO_RAD ]
    } else if (!data3d.rotDeg) {
      // only rot deg missing
      data3d.rotDeg = [ data3d.rotRad[0] * RAD_TO_DEG, data3d.rotRad[1] * RAD_TO_DEG, data3d.rotRad[2] * RAD_TO_DEG ]
    } else {
      // only rot rad missing
      data3d.rotRad = [ data3d.rotDeg[0] * DEG_TO_RAD, data3d.rotDeg[1] * DEG_TO_RAD, data3d.rotDeg[2] * DEG_TO_RAD ]
    }

    // add children
    if (!data3d.children) {
      data3d.children = []
    }

    // resolve meshes
    if (consolidateMeshesEnabled) {
      data3d.meshes = consolidateMeshes(data3d.meshes, el3d ? el3d.params.id : null)
      data3d.meshKeys = Object.keys(data3d.meshes)
    }

    // internals
    var
      meshes = data3d.meshes,
      meshKeys = data3d.meshKeys,
      materials = data3d.materials,
      nodeId = el3d && el3d.params ? el3d.params.id : null,
      i, l, meshId, mesh, materialId, positions, uvs, uvs2, normals, material, materialKeysHaveChanged

    // check meshes
    for (i = 0, l = meshKeys.length; i < l; i++) {

      meshId = meshKeys[ i ]
      mesh = meshes[ meshId ]
      materialId = mesh.material
      material = materials && materials[ materialId ] ? materials[ materialId ] : null
      positions = mesh.positions
      normals = mesh.normals
      uvs = mesh.uvs
      uvs2 = mesh.uvsLightmap

      // mesh position
      if (!mesh.position) {
        mesh.position = [ 0,0,0 ]
      }

      // mesh rotation
      if (!mesh.rotRad && !mesh.rotDeg) {
        // both missing
        mesh.rotDeg = [ 0,0,0 ]
        mesh.rotRad = [ 0,0,0 ]
      } else if (!mesh.rotDeg) {
        // only rot deg missing
        mesh.rotDeg = [ mesh.rotRad[0] * RAD_TO_DEG, mesh.rotRad[1] * RAD_TO_DEG, mesh.rotRad[2] * RAD_TO_DEG ]
      } else {
        // only rot rad missing
        mesh.rotRad = [ mesh.rotDeg[0] * DEG_TO_RAD, mesh.rotDeg[1] * DEG_TO_RAD, mesh.rotDeg[2] * DEG_TO_RAD ]
      }

      // mesh scale
      if (!mesh.scale) {
        mesh.scale = [ 1,1,1 ]
      }

      // mesh in relation to material
      if (material) {

        // check if material with texture has UVs
        if (
          materialHasTexture(material) &&
          (mesh.uvs === undefined || mesh.uvs.length === 0)
        ) {
          // generate fallback UVs
          if (IS_DEBUG_MODE) console.error('Mesh with material "'+materialId+'" has texture(s) has no UVs. Fallback to architectural UV mapping.')
          if (warningCallback) warningCallback('Mesh with material "'+materialId+'" has texture(s) has no UVs. Fallback to architectural UV mapping.')
          mesh.uvs = generateUvs.architectural(mesh.positions)
        }

        // check if material with lightmap has lightmap uvs
        if (
          (material.mapLight || material.mapLightPreview) &&
          (mesh.uvsLightmap === undefined || mesh.uvsLightmap.length === 0)
        ) {
          // delete texture references as we can not generate lightmap fallbacks
          if (IS_DEBUG_MODE) console.error('Mesh with material "'+materialId+'" has lightmap has no lightmap UVs. Lightmap will be ignored.')
          if (warningCallback) warningCallback('Mesh with material "'+materialId+'" has lightmap has no lightmap UVs. Lightmap will be ignored.')
          delete material.mapLight
          delete material.mapLightPreview

        }

        // create fallback material
      } else {
        if (materialId) {
          console.error('Node:'+nodeId+' Material by ID "' + materialId + '" not found.', materials)
          if (warningCallback) warningCallback('Material by ID "' + materialId + '" not found.')
        } else {
          materialId = shortId()
          mesh.material = materialId
        }
        materials[ materialId ] = {
          colorDiffuse: [0.85,0.85,0.85]
        }
        materialKeysHaveChanged = true
      }

    }

    // regenerate material keys if needed
    if (materialKeysHaveChanged) {
      data3d.materialKeys = Object.keys(materials)
    }

    // resolve materials
    if (consolidateMaterialsEnabled) {

      resolvePromises.push(
        consolidateMaterials(data3d.materials).then(function(materials){
          data3d.materials = normalizeMaterials(materials)
          return data3d
        })
      )

    } else {

      data3d.materials = normalizeMaterials(data3d.materials)
      resolvePromises.push(Promise.resolve(data3d))

    }

  })

  return Promise.all(resolvePromises).then(function(){
    return data3d
  })

}

// helpers

function materialHasTexture(m) {
  return m.mapDiffuse ||
    m.mapSpecular ||
    m.mapNormal ||
    m.mapAlpha ||
    m.mapDiffusePreview ||
    m.mapSpecularPreview ||
    m.mapNormalPreview ||
    m.mapAlphaPreview
}

function consolidateMaterials(_materials){

  // TODO: introduce bundled calls to material API to request multiple materials in one call

  var promiseKeys = []
  var promises = []
  var materialKeys = _materials ? Object.keys(_materials) : []
  var materialKey
  var i, l
  // result
  var materials = {}

  if (!materialKeys.length) {
    return Promise.resolve(materials)
  }

  var isExtended = (materialKeys.length && _materials[ materialKeys[0] ].attributes)

  // process
  for (i= 0, l=materialKeys.length; i<l; i++) {
    materialKey = materialKeys[i]

    // shallow clone material
    if (isExtended) {
      materials[ materialKey ] = _materials[ materialKey ].attributes
    } else {
      materials[ materialKey ] = _materials[ materialKey ]
    }

    // convert material ids to attributes
    if (typeof materials[ materialKey ] === 'string') {
      if (materials[ materialKey ][0] === '#') {
        // is hex color definition: convert to rgb
        materials[ materialKey ] = {
          colorDiffuse: hexToRgb(materials[ materialKey ])
        }
      } else {
        // is global id: get attributes from registry
        promiseKeys[ promiseKeys.length ] = materialKey
        promises[ promises.length ] = api.call('Material.get', materials[ materialKey ])
      }
    }

  }

  if (promiseKeys.length === 0) {

    return Promise.resolve(normalizeMaterials(materials))

  } else {

    return Promise.all(promises).then(function(resolvedMaterials){

      // replace resolved materials
      for (i= 0, l=promiseKeys.length; i<l; i++) {
        materials[ promiseKeys[ i ] ] = resolvedMaterials[ i ].attributes
      }

      return normalizeMaterials(materials)

    })

  }

}
  
function consolidateMeshes (meshes, nodeId){
    
    if (!meshes) {

      return meshes

    } else {

      // internals
      var
        meshKeys = Object.keys(meshes),
        i, l, mesh

      for (i = 0, l = meshKeys.length; i < l; i++) {
        mesh = meshes[ meshKeys[ i ] ]

        // check if positions are defined
        if (mesh.positions === undefined || mesh.positions.length === 0) {
          delete meshes[ meshKeys[ i ] ]
          continue
        }
        // check type
        else if (!(mesh.positions instanceof Float32Array)) {
          // convert to float array if needed
          if (mesh.positions instanceof Array) {
            mesh.positions = new Float32Array(mesh.positions)
          }
          // type not supported
          else {
            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position vertices must be of type Float32Array or Array. Mesh will be ignored', mesh.position)
            delete meshes[ meshKeys[ i ] ]
            continue
          }
        }
        // check if multiple of 9
        if (mesh.positions.length/9 % 1 !== 0) {
          if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Invalid position vertices count: ' + mesh.positions.length + '. Has to be multiple of 9. Mesh will be ignored.')
          delete meshes[ meshKeys[ i ] ]
          continue
        }

        // check if normals are defined
        if (mesh.normals === undefined || mesh.normals.length === 0) {
          mesh.normals = generateNormals.flat(mesh.positions)
        }
        // check if normal generation method exists
        else if (typeof mesh.normals === 'string') {
          if (generateNormals[ mesh.normals ]) {
            // generate normals
            mesh.normals = generateNormals[ mesh.normals ](mesh.positions)
          } else {
            // unknown shading method. fallback to flat
            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Unknown normal shading method "' + mesh.normals + '". Fallback to flat shading.')
            mesh.normals = generateNormals.flat(mesh.positions)
          }
        }
        // check type
        else if (!(mesh.normals instanceof Float32Array)) {
          // convert to float array if needed
          if (mesh.normals instanceof Array) {
            mesh.normals = new Float32Array(mesh.normals)
          }
          // type not supported
          else {
            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Normal vertices should be of type Float32Array or Array. Fallback to flat shading.', mesh.normals)
            mesh.normals = generateNormals.flat(mesh.positions)
          }
        }
        // check count
        if (mesh.normals.length !== mesh.positions.length) {
          if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position vertices and normal vertices count has to be the same. Fallback to flat Shading. ', mesh.normals.length, mesh.normals.length)
          mesh.normals = generateNormals.flat(mesh.positions)
        }

        // check uvs channel 1
        if (mesh.uvs) {
          // defined as string
          if (typeof mesh.uvs === 'string') {
            // check if uv generation method exists
            if (generateUvs[ mesh.uvs ]) {
              // generate uvs
              mesh.uvs = generateUvs[ mesh.uvs ](mesh.positions)
            } else {
              // unknown mapping method. fallback to architectural
              if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Unknown UV1 mapping method "' + mesh.uvs + '". Fallback to architectural UV mapping.')
              mesh.uvs = generateUvs.architectural(mesh.positions)
            }
          }
          // check type
          else if (!(mesh.uvs instanceof Float32Array)) {
            // convert to float32array if needed
            if (mesh.uvs instanceof Array) {
              mesh.uvs = new Float32Array(mesh.uvs)
            }
            // mesh uvs not of supported type
            else {
              if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' UV Vertices should be of type Float32Array or Array. Fallback to architectural UV mapping.', mesh.uvs)
              mesh.uvs = generateUvs.architectural(mesh.positions)
            }
          }
          // check length
          if (mesh.uvs.length && mesh.uvs.length * 1.5 !== mesh.positions.length) {
            if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position Vertices and UV vertices count not in ratio of 3:2. Fallback to architectural UV mapping. ', mesh.positions.length, mesh.uvs.length)
            mesh.uvs = generateUvs.architectural(mesh.positions)
          }
        }

        // check uvs channel 2
        if (mesh.uvsLightmap && mesh.uvsLightmap.length && mesh.uvs.length * 1.5 !== mesh.positions.length) {
          if (IS_DEBUG_MODE) console.error('Node:'+nodeId+' Position Vertices and Lightmap UV Vertices count not in ratio of 3:2.', mesh.positions.length, mesh.uvs.length)
          delete mesh.uvsLightmap
        }

      }

      return meshes

    }
  }