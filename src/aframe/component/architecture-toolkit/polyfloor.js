'use strict';

import getSchema from './common/get-schema.js'
import getMaterial from '../../../scene/structure/parametric-objects/common/get-material.js'
import updateSchema from './common/update-schema.js'
import generatePolygonBuffer from '../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'
import getPolyfloorData3d from '../../../scene/structure/parametric-objects/polyfloor'
import dataToMaterials from './common/data-to-materials'

export default {

  schema: getSchema('polyfloor'),

  init: function () {},

  updateSchema: updateSchema,

  update: async function (oldData) {
    var this_ = this
    var data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    attributes.materials = dataToMaterials(data)

    // construct data3d object
    var data3d = await getPolyfloorData3d(attributes)

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
  }
}
