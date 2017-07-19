import checkDependencies from '../check-dependencies.js'

export default {

  schema: {
   lightmapIntensity: {type: 'float', default: 1.0 },
   lightmapCenter: {type: 'float', default: 0.5}
   //falloff: {type: 'float', default: 0.5}
  },

  init: function () {

  },

  update: function () {
    var this_ = this
    var intensity = this_.data.intensity
    var center = this_.data.center

    // data3dview set materials
  },

  remove: function () {
   // data3d view set materials
  }

}

/*
  // When the dropdown is changed by the user, we update the base-product entity accordingly
  select.addEventListener('change', function() {
    shelf.components['base-product'].data['material_Wood'] = this.value
    shelf.components['base-product'].update()
  })
*/