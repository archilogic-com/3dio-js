function traverseData3d(data3d, callback) {

  callback(data3d)

  if (data3d.children) for (var i=0, l=data3d.children.length; i<l; i++) traverseData3d(data3d.children[i], callback)

}

// methods

traverseData3d.materials = function traverseMaterials (data3d, callback) {

  ;(function traverseMaterials_(data3d, callback) {

    var material
    var materialKeys = data3d.materialKeys || Object.keys(data3d.materials || {})
    for (var i = 0; i < materialKeys.length; i++) {
      material = data3d.materials[ materialKeys[ i ] ]
      callback(material, data3d)
    }

    if (data3d.children) {
      for (var i=0, l=data3d.children.length; i<l; i++) {
        traverseMaterials_(data3d.children[i], callback)
      }
    }

  })(data3d, callback)

}

traverseData3d.meshes = function traverseMeshes (data3d, callback) {

  ;(function traverseMeshes_(data3d, callback) {

    var mesh, material
    var meshKeys = data3d.meshKeys || Object.keys(data3d.meshes || {})
    for (var i = 0; i < meshKeys.length; i++) {
      mesh = data3d.meshes[ meshKeys[ i ] ]
      material = data3d.materials[ mesh.material ]
      callback(mesh, material, data3d)
    }

    if (data3d.children) {
      for (var i=0, l=data3d.children.length; i<l; i++) {
        traverseMeshes_(data3d.children[i], callback)
      }
    }

  })(data3d, callback)

}


// API

export default traverseData3d