import cloneData3d from '../../utils/data3d/clone.js'

export default {

  schema: {
    id: {
      type: 'string',
      default: '10344b13-d981-47a0-90ac-f048ee2780a6'
    }
  },

  init: function () {
  },

  update: function (oldData) {
    var this_ = this
    var el = this.el
    var data = this.data
    var furnitureId = data.id
    // check if the furniture id has changed
    var idHasChanged = false
    if ((oldData && oldData.id) && oldData.id !== data.id ) idHasChanged = true
    // check params
    if (!furnitureId || furnitureId === '') return

    // remove old mesh
    this_.remove()

    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new io3d.aframe.three.Data3dView({parent: this_.mesh})
    this_.el.data3dView = this_.data3dView

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

        // clone data3d to avoid reference mix up
        data3d = this_.data3d = cloneData3d(data3d)
        // get material name from inspector
        var materialPropName = 'material_' + meshId.replace(/\s/g, '_')
        // get materialId from aframe attribute or from furniture API scene structure preset
        var newMaterialId = data[materialPropName] || materialPreset && materialPreset[meshId]
        // if we're loading a new furniture piece make sure to load it's material preset
        if (idHasChanged && materialPreset) newMaterialId = materialPreset[meshId]
        // update view with custom material (if available)
        if (newMaterialId) {
          // update material
          data3d.meshes[meshId].material = newMaterialId
          // trigger event
          el.emit('material-changed', {mesh: meshId, material: newMaterialId})
        }

        // register changeable materials schema
        // (not all furniture have changeable materials)
        if (data3d.alternativeMaterialsByMeshKey && data3d.alternativeMaterialsByMeshKey[meshId]) {
          // extend schema with changeable material
          var prop = {}
          prop[materialPropName] = {
            type: 'string',
            default: data3d.meshes[meshId].material,
            oneOf: data3d.alternativeMaterialsByMeshKey[meshId]
          }
          this_.extendSchema(prop)
          // update current params
          this_.data[materialPropName] = data3d.meshes[meshId].material
        }

      })

      // update view
      this_.data3dView.set(data3d, {
        loadingQueuePrefix: 'interior'
      })
      this_.el.data3d = data3d
      this_.el.setObject3D('mesh', this_.mesh)

      // emit events
      if (this_._previousFurnitureId !== furnitureId) {
        this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh})
        this_._previousFurnitureId = furnitureId
      }

    })
    .catch(function(err) {
      console.warn(err)
    })
  },

  remove: function () {
    if (this.data3dView) {
      this.data3dView.destroy()
      this.data3dView = null
      this.el.data3dView = null
    }
    if (this.mesh) {
      this.el.removeObject3D('mesh')
      this.mesh = null
    }
  }

}
