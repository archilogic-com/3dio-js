'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import updateSchema from './common/update-schema.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'

export default {

  schema: getSchema('railing'),

  init: function () {},

  updateSchema: updateSchema,

  update: function (oldData) {
    var this_ = this
    var data = this_.data

    // remove old mesh
    this.remove()

    // get defaults and
    this.attributes = cloneDeep(data)

    // get meshes and materials from el3d modules
    var meshes = this.generateMeshes3d()

    // clean up empty meshes to prevent errors
    var meshKeys = Object.keys(meshes)
    meshKeys.forEach(key => {
      if (!meshes[key].positions || !meshes[key].positions.length) {
        // console.warn('no vertices for mesh', key)
        delete meshes[key]
      }
    })

    // setup materials
    // defaults
    var materials = {
      railing: {
        colorDiffuse: [0.85, 0.85, 0.85]
      }
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

    // construct data3d object
    var data3d = {
      meshes: meshes,
      materials: materials
    }

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

  generateMeshes3d: function () {
    var a = this.attributes

    var
      railingVertices = [],
      rvPos = 0,
      segmentation = a.segmentation,
      segmentLen = (a.l - a.pailing) / (((a.l - a.pailing) / a.segmentDistance) >> 0),
      segments = a.l / segmentLen,
      railCount = Math.max(parseInt(a.railCount), 1),
      segmentHeight = (a.h - (railCount * a.pailing)) / Math.max(railCount - 1, 1)

    if (segmentation === 'number') {
      segments = a.segments
      segmentLen = (a.l - a.pailing) / segments
    }


    //POSTS

    // FRONT VIEW VERTICES
    //   E-----G
    //  /|    /|
    // A-----C |
    // | |   | |
    // | F---|-H
    // |/    |/
    // B-----D

    var aX = 0,
      aY,
      aZ = a.w,
      bY = railCount > 1 ? a.pailing : 0,
      cX = a.pailing,
      eZ = 0

    // posts
    if (segmentation !== 'none') {
      // split them by the rails
      for (var n = 0; n < Math.max(railCount - 1, 1); n++) {
        aY = bY + segmentHeight
        // iterate through posts
        for (var i = 0; i <= segments; i++) {
          var offset = i * segmentLen

          aX = offset
          cX = offset + a.pailing
          //FRONT
          //A
          railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
          railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
          railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
          //B
          railingVertices[rvPos + 3] = aX
          railingVertices[rvPos + 4] = bY
          railingVertices[rvPos + 5] = aZ
          //D
          railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
          railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
          railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
          //C
          railingVertices[rvPos + 15] = cX
          railingVertices[rvPos + 16] = aY
          railingVertices[rvPos + 17] = aZ

          rvPos = rvPos + 18

          //LEFT
          //E
          railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
          railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
          railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
          //F
          railingVertices[rvPos + 3] = aX
          railingVertices[rvPos + 4] = bY
          railingVertices[rvPos + 5] = eZ
          //B
          railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
          railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
          railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
          //A
          railingVertices[rvPos + 15] = aX
          railingVertices[rvPos + 16] = aY
          railingVertices[rvPos + 17] = aZ

          rvPos = rvPos + 18

          //RIGHT
          //C
          railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
          railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
          railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
          //D
          railingVertices[rvPos + 3] = cX
          railingVertices[rvPos + 4] = bY
          railingVertices[rvPos + 5] = aZ
          //H
          railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
          railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
          railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = eZ
          //G
          railingVertices[rvPos + 15] = cX
          railingVertices[rvPos + 16] = aY
          railingVertices[rvPos + 17] = eZ

          rvPos = rvPos + 18

          //BACK
          //G
          railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
          railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
          railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
          //H
          railingVertices[rvPos + 3] = cX
          railingVertices[rvPos + 4] = bY
          railingVertices[rvPos + 5] = eZ
          //F
          railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
          railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
          railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = eZ
          //E
          railingVertices[rvPos + 15] = aX
          railingVertices[rvPos + 16] = aY
          railingVertices[rvPos + 17] = eZ

          rvPos = rvPos + 18
        }
        bY += a.pailing + segmentHeight
      }
    }

    //HANDRAIL

    // start at top for single rail - otherwise at bottom
    var yCursor = segmentation !== 'none' && railCount === 1 ? a.h - a.pailing : 0
    railCount = segmentation !== 'none' ? railCount : 1

    for (var i = 0; i < railCount; i++) {
      // FRONT VIEW VERTICES
      //   E----------G
      //  /|         /|
      // A----------C |
      // | F--------|-H
      // |/         |/
      // B----------D

      aX = 0
      aY = segmentation !== 'none' ? yCursor + a.pailing : a.h
      aZ = a.w
      bY = yCursor
      cX = a.l
      eZ = 0

      //TOP
      //E
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
      //A
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = aY
      railingVertices[rvPos + 5] = aZ
      //C
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = aY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
      //G
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = eZ

      rvPos = rvPos + 18

      //BOTTOM
      //B
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = bY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
      //F
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = eZ
      //H
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = eZ
      //D
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = bY
      railingVertices[rvPos + 17] = aZ

      rvPos = rvPos + 18

      //FRONT
      //A
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
      //B
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = aZ
      //D
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
      //C
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = aZ

      rvPos = rvPos + 18

      //LEFT
      //E
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
      //F
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = eZ
      //B
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
      //A
      railingVertices[rvPos + 15] = aX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = aZ

      rvPos = rvPos + 18

      //RIGHT
      //C
      railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
      //D
      railingVertices[rvPos + 3] = cX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = aZ
      //H
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = eZ
      //G
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = eZ

      rvPos = rvPos + 18

      //BACK
      //G
      railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
      //H
      railingVertices[rvPos + 3] = cX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = eZ
      //F
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = eZ
      //E
      railingVertices[rvPos + 15] = aX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = eZ

      rvPos = rvPos + 18

      yCursor += a.pailing + segmentHeight
    }

    return {
      railing: {
        positions: new Float32Array(railingVertices),
        normals: generateNormals.flat(railingVertices),
        material: 'railing'
      }
    }
  }
}