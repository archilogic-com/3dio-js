// API

var clone = cloneData3d
clone.meshes = cloneMeshes
clone.meshe = cloneSingleMesh
clone.materials = cloneMaterials
clone.material = cloneSingleMaterial

export default clone

// methods

function cloneData3d (_data3d, options) {

    var clone = {}

    clone.meshes = cloneMeshes(_data3d.meshes, options)
    clone.materials = cloneMaterials(_data3d.materials)

    if (_data3d.alternativeMaterialsByMeshKey) {
      clone.alternativeMaterialsByMeshKey = JSON.parse(JSON.stringify(_data3d.alternativeMaterialsByMeshKey))
    }
    if (_data3d._params) {
      clone._params = _data3d._params
    }
    if (_data3d.position) {
      clone.position = _data3d.position.slice(0)
    }
    if (_data3d.rotDeg) {
      clone.rotDeg = _data3d.rotDeg.slice(0)
    }
    if (_data3d.rotRad) {
      clone.rotRad = _data3d.rotRad.slice(0)
    }
    if (_data3d.children) {
      clone.children = _data3d.children.map(function(childData3d){
        return cloneData3d (childData3d, options)
      })
    }

    return clone
  }
  
  function cloneSingleMesh(mesh, options) {
    return cloneMeshes({ x:mesh }, options).x
  }
  
  function cloneMeshes (_meshes, options) {

    if (!_meshes) {
      return {}
    }

    // API
    options = options || {}
    var clonePositions = !!options.clonePositions
    var cloneNormals = !!options.cloneNormals
    var cloneUvs = !!options.cloneUvs
    var cloneUvsLightmap = !!options.cloneUvsLightmap

    // internals
    var
      meshId, _mesh, mesh,
      meshKeys = Object.keys(_meshes),
      meshes = {}

    for (var i = 0, l = meshKeys.length; i < l; i++) {

      meshId = meshKeys[ i ]
      mesh = {}
      _mesh = _meshes[ meshId ]

      // vertices
      if (_mesh.positions) {
        if (clonePositions && (_mesh.positions instanceof Array || _mesh.positions instanceof Float32Array)) {
          mesh.positions = _mesh.positions.slice(0)
        } else {
          mesh.positions = _mesh.positions
        }
      }

      // normals
      if (_mesh.normals) {
        if (cloneNormals && (_mesh.normals instanceof Array || _mesh.normals instanceof Float32Array)) {
          mesh.normals = _mesh.normals.slice(0)
        } else {
          mesh.normals = _mesh.normals
        }
      }

      // uvs
      if (_mesh.uvs) {
        if (cloneUvs && (_mesh.uvs instanceof Array || _mesh.uvs instanceof Float32Array)) {
          mesh.uvs = _mesh.uvs.slice(0)
        } else {
          mesh.uvs = _mesh.uvs
        }
      }

      // uvs lightmap
      if (_mesh.uvsLightmap) {
        if (cloneUvsLightmap && (_mesh.uvsLightmap instanceof Array || _mesh.uvsLightmap instanceof Float32Array)) {
          mesh.uvsLightmap = _mesh.uvsLightmap.slice(0)
        } else {
          mesh.uvsLightmap = _mesh.uvsLightmap
        }
      }

      // other arrays
      if (_mesh.matrix) mesh.matrix = _mesh.matrix.slice(0)
      if (_mesh.uvMatrix) mesh.uvMatrix = _mesh.uvMatrix.slice(0)
      if (_mesh.meshKeys) mesh.meshKeys = _mesh.meshKeys.slice(0)
      if (_mesh.position) mesh.position = _mesh.position.slice(0)
      if (_mesh.rotDeg) mesh.rotDeg = _mesh.rotDeg.slice(0)
      if (_mesh.rotRad) mesh.rotRad = _mesh.rotRad.slice(0)
      if (_mesh.scale) mesh.scale= _mesh.scale.slice(0)

      // primitives
      if (_mesh.v) mesh.v = _mesh.v
      if (_mesh.vertexMode) mesh.vertexMode = _mesh.vertexMode
      if (_mesh.side) mesh.side = _mesh.side
      if (_mesh.material) mesh.material = _mesh.material
      if (_mesh.visibleInPersonView) mesh.visibleInPersonView = _mesh.visibleInPersonView
      if (_mesh.visibleInBirdView) mesh.visibleInBirdView = _mesh.visibleInBirdView
      if (_mesh.visibleInFloorplanView) mesh.visibleInFloorplanView = _mesh.visibleInFloorplanView

      meshes[ meshId ] = mesh
    }

    // output
    return meshes
  }
  
  function cloneSingleMaterial(material) {
    return cloneMaterials({ x:material }).x
  }
  
  function cloneMaterials(_materials) {

    if (!_materials) {
      return {}
    }

    var materialId, _material, materials, material, materialKeys, _attributes, _attributeKeys, attributeKey, type, attributes, isExtended

    materialKeys = Object.keys(_materials)
    // result
    materials = {}

    if (materialKeys.length === 0) {
      return {}
    }

    if (_materials[ materialKeys[0] ].attributes) {
      isExtended = true
      // deep copy source
      materials = JSON.parse(JSON.stringify(_materials))
    } else {
      isExtended = false
    }

    for (var i = 0, l = materialKeys.length; i < l; i++) {

      materialId = materialKeys[ i ]
      _attributes = isExtended ? _materials[ materialId ].attributes : _materials[ materialId ]

      if (typeof _attributes === 'string') {

        if (isExtended) {
          materials[ materialId ].attributes = _attributes
        } else {
          materials[ materialId ] = _attributes
        }

      } else if (_attributes) {

        attributes = {}
        _attributeKeys = Object.keys(_attributes)

        for (var j= 0, k=_attributeKeys.length; j<k; j++) {
          attributeKey = _attributeKeys[j]
          type = typeof _attributes[ attributeKey ]
          if (type === 'string' || type === 'number' || type === 'boolean') {
            // primitive
            attributes[ attributeKey ] = _attributes[ attributeKey ]
          } else if (_attributes[ attributeKey ]) {
            if (_attributes[ attributeKey ].length === 3) {
              // color array
              attributes[ attributeKey ] = [
                _attributes[ attributeKey ][0],
                _attributes[ attributeKey ][1],
                _attributes[ attributeKey ][2]
              ]
            } else if (_attributes[ attributeKey ].length === 2) {
              // size array
              attributes[ attributeKey ] = [
                _attributes[ attributeKey ][0],
                _attributes[ attributeKey ][1]
              ]
            }
          }
        }

        if (isExtended) {
          materials[ materialId ].attributes = attributes
        } else {
          materials[ materialId ] = attributes
        }

      }

    }

    return materials

  }