import callService from '../../utils/services/call'

export default {

  schema: {
    url: {
      type: 'string',
      default: ''
    },
    key: {
      type: 'string',
      default: ''
    },
    scene: {
      type: 'string',
      default: ''
    },
    lightMapIntensity: {
      type: 'float',
      default: 1.2,
      parse: function (value) {
        if (parseFloat(value) >= 0.0) {
          return parseFloat(value)
        }
        return -100.0 // = fallback to value from data3d file
      }
    },
    lightMapExposure: {
      type: 'float',
      default: 0.6,
      parse: function (value) {
        if (parseFloat(value)) {
          return parseFloat(value)
        }
        return -100.0 // = fallback to value from data3d file
      }
    }
  },

  init: function () {
  },

  update: function () {
    var this_ = this
    var url = this_.data.url || this_.data.URL
    var key = this_.data.key || this_.data.KEY
    var scene = this_.data.scene
    var lightMapIntensity = this_.data.lightMapIntensity
    var lightMapExposure = this_.data.lightMapExposure

    if(scene !== '') {
      callService('Model.read', {arguments: { resourceId: scene}}).then(function onResult(result) {
        var level = result.modelStructure.children.filter(function(item) { return item.type === 'level' })[0]
        if (!level) {
          console.error('Unable to load data3d from scene ' + scene + ': The scene does not contain data in the expected format. Error was: No level found.')
          return
        }
        if (!level.bakedModelUrl) {
          console.error('Unable to load data3d from scene ' + scene + ': The scene is not baked. Enable realistic lighting on this scene. Error was: No baked data3d present.')
          return
        }
        var bakedModel = level.bakedModelUrl
        if (bakedModel.split('.')[bakedModel.split('.').length - 1] !== 'buffer') {
          console.error('Unable to load data3d from scene ' + scene + ': The scene is not in Data3D format. Disable and enable realistic lighting on this scene. Error was: No buffer3d found.')
          return
        }
        this_.data.key = bakedModel
        key = bakedModel
        console.log('Loading scene', key)
        this_.data.scene = ''
        this_.update()
      }).catch(function onApiError(err) {
        console.error('Unable to load data3d from scene ' + scene + ': The API returned an error. Error was:', err)
      })
    }

    // check params
    if ((!url || url === '') && (!key || key === '')) return

    // remove old mesh
    this_.remove()

    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new io3d.aframe.three.Data3dView({parent: this_.mesh})
    this_.el.data3dView = this_.data3dView

    // load 3d file
    Promise.resolve().then(function(){
      if (key) {
        return io3d.storage.get(key, { loadingQueuePrefix: 'architecture' })
      } else {
        return io3d.utils.data3d.load(url, { loadingQueuePrefix: 'architecture' })
      }
    }).then(function (data3d) {
      this_.el.data3d = data3d
      // update view
      this_.data3dView.set(data3d, {
        lightMapIntensity: lightMapIntensity,
        lightMapExposure: lightMapExposure,
        loadingQueuePrefix: 'architecture'
      })
      this_.el.setObject3D('mesh', this_.mesh)
      // emit event
      this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
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
