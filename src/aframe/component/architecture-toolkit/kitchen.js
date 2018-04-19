'use strict';

import Promise from 'bluebird'
import getSchema from './common/get-schema.js'
import updateSchema from './common/update-schema.js'
import cloneDeep from 'lodash/cloneDeep'
import kitchenData3d from '../../../scene/structure/parametric-objects/kitchen'

export default {

  schema: getSchema('kitchen'),

  init: function () {},

  updateSchema: updateSchema,

  update: async function (oldData) {
    var this_ = this
    var data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    // setup materials
    // defaults
    let materials = {
      kitchen: 'cabinet_paint_white',
      counter: 'counter_granite_black',
      tab: 'chrome',
      oven: 'oven_miele_60-60',
      cooktop: 'cooktop_westinghouse_60',
      microwave: 'microwave_samsung',
      chrome: 'chrome',
      black_metal: {
        "specularCoef": 24,
        "colorDiffuse": [0.02, 0.02, 0.02],
        "colorSpecular": [0.7, 0.7, 0.7]
      }
    }

    // check for adapted materials
    var materialKeys = Object.keys(data).filter(function(key) {
      return key.indexOf('material_') > -1
    }).forEach(function(key) {
      // add materials to instance
      var mesh = key.replace('material_', '')
      materials[mesh] = data[key]
    })

    attributes.materials=materials;

    // get meshes and materials
    // promised base because it loads external meshes
    var data3d = await kitchenData3d(attributes)


    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh})

    // update view
    this_.data3dView.set(data3d)
    this_.el.setObject3D('mesh', this_.mesh)
    // emit event
    this_.el.emit('mesh-updated');
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
  },


}
