'use strict';

import Promise from 'bluebird'
import getSchema from './common/get-schema.js'
import updateSchema from './common/update-schema.js'
import cloneDeep from 'lodash/cloneDeep'
import getKitchenData3d from '../../../scene/structure/parametric-objects/kitchen'
import dataToMaterials from './common/data-to-materials'
import removeEmptyMeshes from './common/remove-empty-meshes'

export default {

  schema: getSchema('kitchen'),

  init: function () {},

  updateSchema: updateSchema,

  update: async function (oldData) {
    var this_ = this
    var data = this_.data

    // remove old mesh
    this.remove()

    let attributes = cloneDeep(data)

    attributes.materials = dataToMaterials(data)

    // get meshes and materials
    // promise base because it loads external meshes
    var data3d = await getKitchenData3d(attributes)
    removeEmptyMeshes(data3d.meshes)

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
