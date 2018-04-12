'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import updateSchema from './common/update-schema.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../utils/data3d/buffer/get-uvs'
import cloneDeep from 'lodash/cloneDeep'
import wallData3d from '../../../scene/structure/parametric-objects/wall'
import getMaterial from '../../../aframe/component/architecture-toolkit/common/get-material'

export default {

  schema: getSchema('wall'),

  init: function () {
    var this_ = this
    // avoid simultanous update calls
    this.throttledUpdate = AFRAME.utils.throttle(this.update, 10, this);
    // bind event listeners for child elements
    this.updateChildren()
    // listen for added or removed children
    this.el.addEventListener('child-attached', function(evt) {
      // wait for a bit to make sure the child component is set up
      setTimeout(function() {
        this_.throttledUpdate()
        this_.updateChildren()
      }, 10)
    })
    this.el.addEventListener('child-detached', function(evt) {
      setTimeout(function() {
        this_.throttledUpdate()
      }, 10)
    })
  },

  updateChildren: function() {
    var this_ = this
    var children = this.el.children
    // listen to children, for updated positions
    if (children && children.length) {
      for (var i = 0; i < children.length; i++) {
        children[i].addEventListener('componentchanged', function() {
          setTimeout(function() {
            // FIXME: we need to wait till the new data is actually available
            this_.throttledUpdate()
          }, 20)
        })
      }
    }
  },

  updateSchema: updateSchema,

  update: async function (oldData) {
    var this_ = this
    var data = this_.data

    if (!oldData || this.data.w !== oldData.w || this.data.controlLine !== oldData.controlLine ) {
      this.el.emit('wall-changed', {w: this.data.w, controlLine: this.data.controlLine})
    }

    // remove old mesh
    this.remove()

    // get defaults and
    let attributes = cloneDeep(data)

    // get children for walls
    var children = this_.el.children
    attributes.children = []
    for (var i = 0; i < children.length; i++) {
      var c = children[i].getAttribute('io3d-window') || children[i].getAttribute('io3d-door')
      if (c) {
        if (children[i].getAttribute('io3d-window')) c.type = 'window'
        else if (children[i].getAttribute('io3d-door')) c.type = 'door'
        var pos = children[i].getAttribute('position')
        Object.keys(pos).forEach(p => {
          c[p] = pos[p]
        })
        attributes.children.push(c)
      } else console.log('invalid child')
    }
    // this.attributes.children = this.attributes.children.map(c => mapAttributes(cloneDeep(getType.get(c.type).params), c))


    // setup materials
    // defaults
    let materials = {
      front: 'default_plaster_001', //'basic-wall',
      back: 'default_plaster_001', //'basic-wall',
      base: {
        colorDiffuse: [ 0.95, 0.95, 0.95 ]
      },
      top: 'wall_top'
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

    // fetch materials from mat library
    Object.keys(materials).forEach(mat => {
      materials[mat] = getMaterial(materials[mat])
    })

    attributes.materials = materials


    // get meshes and materials from el3d modules
    let data3d = await wallData3d(attributes)

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
