'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import updateSchema from './common/update-schema.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'
import doorData3d from '../../../scene/structure/parametric-objects/door'

export default {

  schema: getSchema('door'),

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
    // if we have no event yet we need to get the attributes directly
    if (!evt) {
      var wallAttributes = this.el.parentEl.getAttribute('io3d-wall')
      if (wallAttributes) {
        // let's make sure we deal with an object
        if (typeof wallAttributes === 'string') wallAttributes = AFRAME.utils.styleParser.parse(wallAttributes)
        this.wallWidth = wallAttributes.w
        this.wallControlLine = wallAttributes.controlLine
      }
    } else {
      this.wallWidth = evt.detail.w
      this.wallControlLine = evt.detail.controlLine
    }
    this.update()
  },

  updateSchema: updateSchema,

  update: async function (oldData) {
    var this_ = this
    var data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    /*
    // clean up empty meshes to prevent errors
    var meshKeys = Object.keys(meshes)
    meshKeys.forEach(key => {
      if (!meshes[key].positions || !meshes[key].positions.length) {
        // console.warn('no vertices for mesh', key)
        delete meshes[key]
      }
    })
    */

    // setup materials
    // defaults
    var materials = {
      frame: {
        colorDiffuse: [0.95, 0.95, 0.95],
        colorSpecular: [0.04, 0.04, 0.04],
        specularCoef: 30
      },
      leaf: 'doorLeaf-flush-white',
      handle: 'aluminium',
      threshold: 'wood_parquet_oak'
    }

    // check for adapted materials
    var materialKeys = Object.keys(data).filter(function(key) {
      return key.indexOf('material_') > -1
    })
    // add materials to instance
    materialKeys.forEach(function(key) {
      var mesh = key.replace('material_', '')
      materials[mesh] = data[key]
    })

    attributes.materials=materials

    // construct data3d object
    var data3d = await doorData3d(attributes)

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

  generateMeshes3d: function () {
  }
}
