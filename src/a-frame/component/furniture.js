import checkDependencies from '../check-dependencies.js'

export default {

  schema: {
    id: {
      type: 'string',
      default: '10344b13-d981-47a0-90ac-f048ee2780a6'
    }
  },

  init: function () {
  },

  update: function () {
    var this_ = this
    var el = this.el
    var data = this.data
    var furnitureId = data.id

    // check params
    if (!furnitureId || furnitureId === '') return

    // remove old mesh
    this_.remove()

    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh})

    // get furniture data
    io3d.furniture.get(furnitureId).then(function (result) {

      var info = result.info // lightweight info like name, manufacturer, description...
      var data3d = result.data3d // geometries and materials
      var availableMaterials = {}

      // Expose properties
      this_.info = info
      this_.data3d = data3d
      this_.availableMaterials = availableMaterials

      // check for material presets in the furniture sceneStructure definition
      var materialPreset = info.sceneStructure && JSON.parse(info.sceneStructure).materials
      // Parse materials
      Object.keys(data3d.meshes).forEach(function eachMesh (meshId) {
        availableMaterials[meshId] = data3d.alternativeMaterialsByMeshKey ? data3d.alternativeMaterialsByMeshKey[meshId] : data3d.meshes[meshId].material

        // get material name from inspector
        var materialPropName = 'material_' + meshId.replace(/\s/g, '_')
        // get materialId from a-frame attribute or from furniture API scene structure preset
        var newMaterialId =  data[materialPropName] || (materialPreset ? materialPreset[meshId] : null)

        // set custom material if available
        if (newMaterialId) {

          // update material
          data3d.meshes[meshId].material = newMaterialId
          // trigger event
          el.emit('material-changed', {mesh: meshId, material: newMaterialId})

        } else {

          // register it as part of the schema for the inspector
          var prop = {}
          prop[materialPropName] = {
            type: 'string',
            default: data3d.meshes[meshId].material,
            oneOf: data3d.alternativeMaterialsByMeshKey ? data3d.alternativeMaterialsByMeshKey[meshId] : data3d.meshes[meshId].material
          }
          this_.extendSchema(prop)
          this_.data[materialPropName] = data3d.meshes[meshId].material

        }
      })

      // update view
      this_.data3dView.set(data3d)
      this_.el.data3d = data3d
      this_.el.setObject3D('mesh', this_.mesh)

      // emit events
      if (this_._previousFurnitureId !== furnitureId) {
        this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh})
        this_._previousFurnitureId = furnitureId
      }

    })
  },

  remove: function () {
    if (this.data3dView) {
      this.data3dView.destroy()
      this.data3dView = null
    }
    if (this.mesh) {
      this.el.removeObject3D('mesh')
      this.mesh = null
    }
  }

}
