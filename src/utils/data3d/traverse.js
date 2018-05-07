import cloneDeep from 'lodash/cloneDeep'

function traverseData3d(data3d, callback) {
  console.log('traverseData3d', data3d._params.type)
  callback(data3d)
  if (data3d.children) {
    for (var i=0, l=data3d.children.length; i<l; i++) {
      traverseData3d(data3d.children[i], callback)
    }
  }
}

// methods

traverseData3d.materials = function (data3d) {
  var materials = []

  traverseData3d(data3d, function(data3dNode){
    var newMaterials = Object.keys(data3dNode.materials).map( mk => data3dNode.materials[mk] )
    console.log('traverseData3d.materials', data3d._params.type, JSON.stringify(data3dNode.materials))

    materials.concat( newMaterials )
  })

  return materials;
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
