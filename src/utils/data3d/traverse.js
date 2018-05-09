import cloneDeep from 'lodash/cloneDeep'

function traverseData3d(data3d, callback) {
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
    if (!data3dNode.materials) return
    var newMaterials = Object.keys(data3dNode.materials).map( mk => data3dNode.materials[mk] )

    materials = materials.concat( newMaterials )
  })

  return materials;
}


// API

export default traverseData3d
