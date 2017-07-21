import checkDependencies from '../check-dependencies.js'

export default {

  schema: {
    id: {
      type: 'string',
      default: '10344b13-d981-47a0-90ac-f048ee2780a6'
    },
    lightMapIntensity: {
      // type is array so that we can fallback to value specified in data3d file
      type: [],
      parse: function (value) {
        if (value < 0) return null // = fallback to value from data3d file
        return value
      }
    },
    lightMapExposure: {
      // type is array so that we can fallback to value specified in data3d file
      type: []
    }
  },

  init: function () {
  },

  update: function () {
    var this_ = this
    var productId = this_.data.id
    var lightMapIntensity = this_.data.lightMapIntensity
    var lightMapExposure = this_.data.lightMapExposure

    // check params
    if (!productId || productId === '') return

    // remove old mesh
    this_.remove()

    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new IO3D.aFrame.three.Data3dView({parent: this_.mesh})

    // get product data
    IO3D.furniture.get(productId).then(function (result) {
      // Expose properties
      this_.productInfo = result
      this_.data3d = result.data3d

      // Parse & expose materials
      this_.availableMaterials = {}
      Object.keys(result.data3d.meshes).forEach(function eachMesh (meshName) {
        this_.availableMaterials[meshName] = result.data3d.alternativeMaterialsByMeshKey ? result.data3d.alternativeMaterialsByMeshKey[meshName] : result.data3d.meshes[meshName].material

        //update material based on inspector
        var materialPropName = 'material_' + meshName.replace(/\s/g, '_')
        if (this_.data[materialPropName] !== undefined) {
          result.data3d.meshes[meshName].material = this_.data[materialPropName]
          this_.el.emit('material-changed', {mesh: meshName, material: this_.data[materialPropName]})
        } else {
          // register it as part of the schema for the inspector
          var prop = {}
          prop[materialPropName] = {
            type: 'string',
            default: result.data3d.meshes[meshName].material,
            oneOf: result.data3d.alternativeMaterialsByMeshKey ? result.data3d.alternativeMaterialsByMeshKey[meshName] : result.data3d.meshes[meshName].material
          }
          this_.extendSchema(prop)
          this_.data[materialPropName] = result.data3d.meshes[meshName].material
        }
      })

      // update view
      this_.data3dView.set(result.data3d, { lightMapIntensity: lightMapIntensity, lightMapExposure: lightMapExposure })
      this_.el.data3d = result.data3d
      this_.el.setObject3D('mesh', this_.mesh)
      // emit event
      if (this_._prevId !== productId) this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
      this_._prevId = productId
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
