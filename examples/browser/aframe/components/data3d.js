(function(AFRAME){

  AFRAME.registerComponent('base-data3d', {

    schema: {
      url: {
        type: 'string',
        default: ''
      },
      key: {
        type: 'string',
        default: ''
      }
    },

    init: function () {
      this.model = new THREE.Object3D()
      this.data3dView = new BASE.three.View({ parent: this.model })
    },

    update: function () {
      var self = this
      var el = this.el
      var url = this.data.url
      var key = this.data.key

      // check params
      if ((!url || url === '') && (!key || key === '')) return

      //this.remove()

      // load 3d file
      (key ? BASE.store.get(key) : BASE.data3d.load(url)).then(function(data3d){
        // update view
        self.data3dView.set(data3d)
        //self.system.registerModel(this.model)
        el.setObject3D('mesh', self.model);
        el.emit('model-loaded', {format: 'data3d', model: self.model});

      })
    },

    remove: function () {
      if (!this.model) { return; }
      this.el.removeObject3D('mesh');
      //this.system.unregisterModel(this.model);
    }

  })

  // helpers

  function isAbsoluteUrl(url) {
    return url.substr(0,7) === 'http://' || url.substr(0,8) === 'https://'
  }

  function removeLeadingSlash(str) {
    return str[0] === '/' ? str.substr(1) : str
  }

})(AFRAME)