'use strict';

import getSchema from './common/get-schema.js'
import getMaterial from '../../../scene/structure/parametric-objects/common/get-material.js'
import updateSchema from './common/update-schema.js'
import cloneDeep from 'lodash/cloneDeep'
import getWindowData3d from '../../../scene/structure/parametric-objects/window'
import dataToMaterials from './common/data-to-materials'
import removeEmptyMeshes from './common/remove-empty-meshes'

export default {

  schema: getSchema('window'),

  init: function () {
    var this_ = this
    // listen to wall parent for updated geometry
    this.el.parentEl.addEventListener('wall-changed', this.updateFromWall)
    // FIXME: check for parent initially - we need to wait till it is available
    setTimeout(function() {
      this_.updateFromWall()
    }, 20)
  },

  updateFromWall: function(evt) {
    let parentAttributes = {}
    // if we have no event yet we need to get the attributes directly
    if (!evt) {
      var wallAttributes = this.el.parentEl.getAttribute('io3d-wall')
      if (wallAttributes) {
        // let's make sure we deal with an object
        if (typeof wallAttributes === 'string') wallAttributes = AFRAME.utils.styleParser.parse(wallAttributes)
        parentAttributes.w = wallAttributes.w
        parentAttributes.controlLine = wallAttributes.controlLine
      }
    } else {
      parentAttributes.w = evt.detail.w
      parentAttributes.controlLine = evt.detail.controlLine
    }
    this.update(parentAttributes)
  },

  updateSchema: updateSchema,

  update: function (parentAttributes) {
    var this_ = this
    let data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    // remove glass mesh if needed
    var deleteGlass = data.hideGlass === 'true'

    attributes.materials = dataToMaterials(data);

    // construct data3d object
    getWindowData3d(attributes, parentAttributes)
    .then(data3d => {
      removeEmptyMeshes(data3d.meshes)

      if (deleteGlass) delete data3d.meshes.glass

      // create new one
      this_.mesh = new THREE.Object3D()
      this_.data3dView = new io3d.aFrame.three.Data3dView({parent: this_.mesh})

      // update view
      this_.data3dView.set(data3d)
      this_.el.setObject3D('mesh', this_.mesh)
      // emit event
      this_.el.emit('mesh-updated')
    })
  },

  remove: function () {
    this.el.parentEl.removeEventListener('wall-changed', this.updateFromWall)
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
