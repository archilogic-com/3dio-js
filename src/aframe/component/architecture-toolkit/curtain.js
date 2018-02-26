'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import updateSchema from './common/update-schema.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'

export default {

  schema: getSchema('curtain'),

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
      curtain: {
        colorDiffuse: [0.844,0.82,0.7695]
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

    // internals
    var curtainVertices = [],
      cvPos = 0,
      curtainUvs = [],
      cvUvPos = 0,
      folds = Math.round(a.folds-0.1*(a.folds/a.l)),
      scaleTop = 0.05,
      scaleBottom = a.w,
      foldLength=a.l/folds

    //CURTAIN

    // A--D
    // |  |
    // B--C

    var aX,aY,aZ,bY,bZ,cX,cZ,dZ
    dZ = Math.random()*scaleTop
    cZ = Math.random()*scaleBottom
    aY = a.h
    bY = 0
    for (var i=0;i<folds; i++){
      aZ = dZ
      bZ = cZ
      dZ = Math.random()*scaleTop
      cZ = Math.random()*scaleBottom
      aX = foldLength*i
      cX = foldLength*(i+1)


      //A
      curtainVertices[cvPos] = curtainVertices[cvPos+9] = aX
      curtainVertices[cvPos+1] = curtainVertices[cvPos+10] = aY
      curtainVertices[cvPos+2] = curtainVertices[cvPos+11] = aZ
      //B
      curtainVertices[cvPos+3] = aX
      curtainVertices[cvPos+4] = bY
      curtainVertices[cvPos+5] = bZ
      //C
      curtainVertices[cvPos+6] = curtainVertices[cvPos+12] = cX
      curtainVertices[cvPos+7] = curtainVertices[cvPos+13] = bY
      curtainVertices[cvPos+8] = curtainVertices[cvPos+14] = cZ
      //D
      curtainVertices[cvPos+15] = cX
      curtainVertices[cvPos+16] = aY
      curtainVertices[cvPos+17] = dZ

      cvPos = cvPos+18

      //A
      curtainUvs [cvUvPos]  = curtainUvs [cvUvPos + 6] = aX
      curtainUvs [cvUvPos + 1] = curtainUvs [cvUvPos + 7]  = aY
      //B
      curtainUvs [cvUvPos + 2] = aX
      curtainUvs [cvUvPos + 3] = bY
      //C
      curtainUvs [cvUvPos + 4] = curtainUvs [cvUvPos + 8] = cX
      curtainUvs [cvUvPos + 5] = curtainUvs [cvUvPos + 9] = bY
      //D
      curtainUvs [cvUvPos + 10] = cX
      curtainUvs [cvUvPos + 11] = aY

      cvUvPos = cvUvPos+12

      // BACKFACE FIXME proper double sided solution

      //A
      curtainVertices[cvPos] = curtainVertices[cvPos+9] = aX
      curtainVertices[cvPos+1] = curtainVertices[cvPos+10] = aY
      curtainVertices[cvPos+2] = curtainVertices[cvPos+11] = aZ-0.01
      //C
      curtainVertices[cvPos+3] = curtainVertices[cvPos+15] = cX
      curtainVertices[cvPos+4] = curtainVertices[cvPos+16] = bY
      curtainVertices[cvPos+5] = curtainVertices[cvPos+17] = cZ-0.01
      //B
      curtainVertices[cvPos+6] = aX
      curtainVertices[cvPos+7] = bY
      curtainVertices[cvPos+8] = bZ-0.01
      //D
      curtainVertices[cvPos+12] = cX
      curtainVertices[cvPos+13] = aY
      curtainVertices[cvPos+14] = dZ-0.01

      cvPos = cvPos+18

      //A
      curtainUvs [cvUvPos]  = curtainUvs [cvUvPos + 6] = aX
      curtainUvs [cvUvPos + 1] = curtainUvs [cvUvPos + 7]  = aY
      //C
      curtainUvs [cvUvPos + 2] = curtainUvs [cvUvPos + 10] = cX
      curtainUvs [cvUvPos + 3] = curtainUvs [cvUvPos + 11] = bY
      //B
      curtainUvs [cvUvPos + 4] = aX
      curtainUvs [cvUvPos + 5] = bY
      //D
      curtainUvs [cvUvPos + 8] = cX
      curtainUvs [cvUvPos + 9] = aY

      cvUvPos = cvUvPos+12

    }

    return {
      curtain: {
        positions: new Float32Array(curtainVertices),
        normals: generateNormals.smooth(curtainVertices),
        uvs: new Float32Array(curtainUvs),
        material: 'curtain'
      }
    }
    
  }
}