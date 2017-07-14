(function(AFRAME){

  AFRAME.registerComponent('base-product', {

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
      var productId = this_.data.id
      
      // check params
      if (!productId || productId === '') return

      // remove old mesh
      this_.remove()
      
      // create new one
      this_.mesh = new THREE.Object3D()
      this_.data3dView = new BASE.three.Data3dView({ parent: this_.mesh })
      
      // get product data
      BASE.product.get(productId).then(function(result){
        // update view
        this_.data3dView.set(result.data3d)
        this_.el.setObject3D('mesh', this_.mesh)
        // emit event
        this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
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

  })
  
})(AFRAME)