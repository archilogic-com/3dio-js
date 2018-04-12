'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import updateSchema from './common/update-schema.js'
import cloneDeep from 'lodash/cloneDeep'
import windowData3d from '../../../scene/structure/parametric-objects/window'

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
        parentAttributes.wallWidth = wallAttributes.w
        parentAttributes.wallControlLine = wallAttributes.controlLine
      }
    } else {
      parentAttributes.wallWidth = evt.detail.w
      parentAttributes.wallControlLine = evt.detail.controlLine
    }
    this.update(parentAttributes)
  },

  updateSchema: updateSchema,

  update: async function (parentAttributes) {
    var this_ = this
    let data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    // remove glass mesh if needed
    var deleteGlass = data.hideGlass === 'true'


    // setup materials
    // defaults
    let materials = {
      frame: {
        colorDiffuse: [0.85, 0.85, 0.85]
      },
      glass: 'glass'
    }

    // check for adapted materials
    var materialKeys = Object.keys(data).filter(function(key) {
      return key.indexOf('material_') > -1
    })
    // add materials to instance
    var props = {}
    materialKeys.forEach(function(key) {
      props[key] = {
        type: 'string'
      }

      var mesh = key.replace('material_', '')
      materials[mesh] = data[key]
    })

    this_.extendSchema(props)

    // fetch materials from mat library
    Object.keys(materials).forEach(mat => {
      materials[mat] = getMaterial(materials[mat])
    })

    attributes.materials = materials;

    // construct data3d object
    let data3d = await windowData3d(attributes, parentAttributes)
    if (deleteGlass) delete data3d.meshes.glass

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

}
