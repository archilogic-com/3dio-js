'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'

export default {

  schema: getSchema('door'),

  init: function () {
    var this_ = this
    // listen to wall parent for updated geometry
    this.el.parentEl.addEventListener('wall-changed', function(evt) {
      this_.wallWidth = evt.detail.w
      this_.wallControlLine = evt.detail.controlLine
      this_.update()
    })
  },

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
    this_.data3dView = new IO3D.aFrame.three.Data3dView({parent: this_.mesh})

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

    var wallWidth = 0.15
    var wallControlLine = 'back'
    // get parent wall attributes
    if (this.wallWidth || this.wallControlLine) {
      wallWidth = this.wallWidth
      wallControlLine = this.wallControlLine
      a.w = wallWidth
    }

    // definitions
    var
      wallBackPos = wallControlLine === 'front' ? -wallWidth : wallControlLine === 'center' ? -wallWidth / 2 : 0,
      wallFrontPos = wallWidth + wallBackPos,
      frameLength = a.frameLength,
      frameWidth = a.w,
      leafLength = a.l - (frameLength * 2),
      leafOffset = a.leafOffset,
      frameOffset = a.frameOffset,
      prevLeafs = 0,
      doorType = a.doorType,
      threshold = a.threshold,
      thresholdHeight = a.thresholdHeight,
      leaf,
      doorOpening = a.l - (frameLength * 2),
      handleHeight = 1,
      handleThickness = 0.018,
      handleLength = 0.13,
      handleWidth = 0.035,
      handleDistance = 0.06, //Dornmass
      handlePlateLength = 0.04,
      handlePlateHeight = 0.21,
      handlePlateWidth = 0.002,
      handlePlateDistance = handleDistance+handleThickness/2-handlePlateLength/ 2,
      leafGap = threshold && thresholdHeight ? thresholdHeight : 0.005,

      // internals

      frameFacesCount = 0,
      floorFacesCount = threshold ? thresholdHeight > 0 ? 6 : 2 : 0,
      hvPos = 0,
      fvPos = 0,
      lvPos = 0,
      lvUvPos = 0,
      xCursor = 0,
      zCursor, xRotate, sinAngle, cosAngle, rotationOffset, lvs, lve, hvs, hve, hvf, hvt, hvm = [],
      aX,aY,aZ,bY,cX,cZ,dY,eX,eZ,gX,iZ,mZ,uZ

    // DOOR TYPE CONFIGURATIONS

    // swing default
    if (doorType==='singleSwing') {
      leaf = [{
        leafLength : leafLength,
        handle : true,
        angle : a.doorAngle
      }]
    } else if (doorType==='opening') {
      leaf = []
    } else if (doorType==='doubleSwing') {
      leaf = [{
        leafLength : leafLength/2,
        handle : true,
        angle : a.doorAngle
      },
        {
          leafLength : leafLength/2,
          handle : true,
          angle : a.doorAngle,
          flipLeaf : true
        }]
    } else if (doorType==='swingFix') {
      leaf = [{
        leafLength : doorOpening * (1-a.fixLeafRatio),
        handle : true,
        angle : a.doorAngle
      },
        {
          leafLength : doorOpening * a.fixLeafRatio,
          handle : false,
          angle : 0
        }]
      if (a.hinge==='left') leaf.reverse()
    } else if (doorType==='swingDoubleFix') {
      leaf = [{
        leafLength : doorOpening * a.fixLeafRatio/2,
        handle : false,
        angle : 0
      },
        {
          leafLength : doorOpening * (1-a.fixLeafRatio),
          handle : true,
          angle : a.doorAngle
        },
        {
          leafLength : doorOpening * a.fixLeafRatio/2,
          handle : false,
          angle : 0
        }]
      if (a.hinge==='left') leaf.reverse()
    } else if (doorType==='doubleSwingDoubleFix') {
      leaf = [{
        leafLength : doorOpening * a.fixLeafRatio/2,
        handle : false,
        angle : 0
      },
        {
          leafLength : doorOpening * ((1-a.fixLeafRatio)/2),
          handle : true,
          angle : a.doorAngle
        },
        {
          leafLength : doorOpening * ((1-a.fixLeafRatio)/2),
          handle : true,
          angle : a.doorAngle,
          flipLeaf : true
        },
        {
          leafLength : doorOpening * a.fixLeafRatio/2,
          handle : false,
          angle : 0
        }]
    } else if (doorType==='slidingDoor') {
      leaf = [{
        leafLength : leafLength* (1-a.doorAngle/180),
        handle : false,
        angle : 0
      }]
      leafOffset = -0.1
      if (a.hinge==='left') xCursor = doorOpening - leafLength* (1-a.doorAngle/180)
    } else {
      // Fallback old doors
      a.doorType = 'singleSwing'
      leaf = [{
        leafLength : leafLength,
        handle : true,
        angle : a.doorAngle
      }]
    }

    // FIXME Workaround for older Doors - remove Feb '16
    if (leafOffset>0.005) leafOffset = 0.005

    // Set Face Count
    if (frameLength>0) {
      frameFacesCount += 18
      if (frameOffset>0) frameFacesCount += 12
    }
    var leafVertices = [], //new Float32Array(leafFacesCount * 9),
      handleVertices = [], //new Float32Array(handleFacesCount * 9),
      leafUvs = [], //new Float32Array(leafFacesCount * 6),
      frameVertices = new Float32Array(frameFacesCount * 9)

    // Threshold VERTICES
    //
    //   E------G
    //  /|     /|
    // A------C |
    // | F----|-H
    // |/     |/
    // B------D
    var floorVertices = new Float32Array(floorFacesCount * 9),
      floorUvs = new Float32Array(floorFacesCount * 6),
      wvPos = 0,
      fvUvPos = 0

    aX = frameLength
    aY = thresholdHeight
    aZ = wallFrontPos
    bY = 0
    cX = a.l - frameLength
    eZ = wallBackPos

    if (threshold) {
      // Top
      //E
      floorVertices[wvPos] = floorVertices[wvPos + 9] = aX
      floorVertices[wvPos + 1] = floorVertices[wvPos + 10] = aY
      floorVertices[wvPos + 2] = floorVertices[wvPos + 11] = eZ
      //A
      floorVertices[wvPos + 3] = aX
      floorVertices[wvPos + 4] = aY
      floorVertices[wvPos + 5] = aZ
      //C
      floorVertices[wvPos + 6] = floorVertices[wvPos + 12] = cX
      floorVertices[wvPos + 7] = floorVertices[wvPos + 13] = aY
      floorVertices[wvPos + 8] = floorVertices[wvPos + 14] = aZ
      //G
      floorVertices[wvPos + 15] = cX
      floorVertices[wvPos + 16] = aY
      floorVertices[wvPos + 17] = eZ

      floorUvs [fvUvPos] = floorUvs [fvUvPos + 2] = floorUvs [fvUvPos + 6] = 1 - cX
      floorUvs [fvUvPos + 1] = floorUvs [fvUvPos + 7] = floorUvs [fvUvPos + 11] = aZ
      floorUvs [fvUvPos + 3] = floorUvs [fvUvPos + 5] = floorUvs [fvUvPos + 9] = 0
      floorUvs [fvUvPos + 4] = floorUvs [fvUvPos + 8] = floorUvs [fvUvPos + 10] = 1

      wvPos += 18
      fvUvPos += 12

      if (thresholdHeight > 0) {
        // Front
        //A
        floorVertices[wvPos] = floorVertices[wvPos + 9] = aX
        floorVertices[wvPos + 1] = floorVertices[wvPos + 10] = aY
        floorVertices[wvPos + 2] = floorVertices[wvPos + 11] = aZ
        //B
        floorVertices[wvPos + 3] = aX
        floorVertices[wvPos + 4] = bY
        floorVertices[wvPos + 5] = aZ
        //D
        floorVertices[wvPos + 6] = floorVertices[wvPos + 12] = cX
        floorVertices[wvPos + 7] = floorVertices[wvPos + 13] = bY
        floorVertices[wvPos + 8] = floorVertices[wvPos + 14] = aZ
        //C
        floorVertices[wvPos + 15] = cX
        floorVertices[wvPos + 16] = aY
        floorVertices[wvPos + 17] = aZ

        floorUvs [fvUvPos] = floorUvs [fvUvPos + 2] = floorUvs [fvUvPos + 6] = 1 - cX
        floorUvs [fvUvPos + 1] = floorUvs [fvUvPos + 7] = floorUvs [fvUvPos + 11] = thresholdHeight
        floorUvs [fvUvPos + 3] = floorUvs [fvUvPos + 5] = floorUvs [fvUvPos + 9] = 0
        floorUvs [fvUvPos + 4] = floorUvs [fvUvPos + 8] = floorUvs [fvUvPos + 10] = 1

        wvPos += 18
        fvUvPos += 12

        // Back
        //G
        floorVertices[wvPos] = floorVertices[wvPos + 9] = cX
        floorVertices[wvPos + 1] = floorVertices[wvPos + 10] = aY
        floorVertices[wvPos + 2] = floorVertices[wvPos + 11] = eZ
        //H
        floorVertices[wvPos + 3] = cX
        floorVertices[wvPos + 4] = bY
        floorVertices[wvPos + 5] = eZ
        //F
        floorVertices[wvPos + 6] = floorVertices[wvPos + 12] = aX
        floorVertices[wvPos + 7] = floorVertices[wvPos + 13] = bY
        floorVertices[wvPos + 8] = floorVertices[wvPos + 14] = eZ
        //E
        floorVertices[wvPos + 15] = aX
        floorVertices[wvPos + 16] = aY
        floorVertices[wvPos + 17] = eZ

        floorUvs [fvUvPos] = floorUvs [fvUvPos + 2] = floorUvs [fvUvPos + 6] = 1 - cX
        floorUvs [fvUvPos + 1] = floorUvs [fvUvPos + 7] = floorUvs [fvUvPos + 11] = thresholdHeight
        floorUvs [fvUvPos + 3] = floorUvs [fvUvPos + 5] = floorUvs [fvUvPos + 9] = 0
        floorUvs [fvUvPos + 4] = floorUvs [fvUvPos + 8] = floorUvs [fvUvPos + 10] = 1
      }
    }

    // DOOR FRAME CREATION
    if (frameLength>0) {

      // DOOR FRAME FRONT

      //  A/I-------H/L
      //   |  D---E  |
      //   |  |   |  |
      //   |  |   |  |
      //  B/J-C   F-G/K

      // DOOR FRAME BACK

      //  M/U-------T/X
      //   |  P---Q  |
      //   |  |   |  |
      //   |  |   |  |
      //  N/V-O   R-S/W

      aX = 0
      aY = a.h
      aZ = wallFrontPos + frameOffset
      bY = 0
      cX = frameLength
      dY = a.h - frameLength
      eX = a.l - frameLength
      gX = a.l
      iZ = wallFrontPos
      mZ = wallBackPos - frameOffset
      uZ = wallBackPos

      // DOOR FRAME FRONT FACES
      // A
      frameVertices[fvPos] = frameVertices[fvPos + 9] = aX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = aY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = aZ
      // B
      frameVertices[fvPos + 3] = aX
      frameVertices[fvPos + 4] = bY
      frameVertices[fvPos + 5] = aZ
      // C
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = cX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = bY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = aZ
      // D
      frameVertices[fvPos + 15] = cX
      frameVertices[fvPos + 16] = dY
      frameVertices[fvPos + 17] = aZ

      fvPos += 18
      // A
      frameVertices[fvPos] = frameVertices[fvPos + 9] = aX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = aY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = aZ
      // D
      frameVertices[fvPos + 3] = cX
      frameVertices[fvPos + 4] = dY
      frameVertices[fvPos + 5] = aZ
      // E
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = eX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = dY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = aZ
      // H
      frameVertices[fvPos + 15] = gX
      frameVertices[fvPos + 16] = aY
      frameVertices[fvPos + 17] = aZ

      fvPos += 18
      // E
      frameVertices[fvPos] = frameVertices[fvPos + 9] = eX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = dY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = aZ
      // F
      frameVertices[fvPos + 3] = eX
      frameVertices[fvPos + 4] = bY
      frameVertices[fvPos + 5] = aZ
      // G
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = gX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = bY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = aZ
      // H
      frameVertices[fvPos + 15] = gX
      frameVertices[fvPos + 16] = aY
      frameVertices[fvPos + 17] = aZ

      fvPos += 18

      // DOOR FRAME BACK FACES

      // M
      frameVertices[fvPos] = frameVertices[fvPos + 9] = gX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = aY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = mZ
      // N
      frameVertices[fvPos + 3] = gX
      frameVertices[fvPos + 4] = bY
      frameVertices[fvPos + 5] = mZ
      // O
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = eX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = bY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = mZ
      // P
      frameVertices[fvPos + 15] = eX
      frameVertices[fvPos + 16] = dY
      frameVertices[fvPos + 17] = mZ

      fvPos += 18

      // M
      frameVertices[fvPos] = frameVertices[fvPos + 9] = gX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = aY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = mZ
      // P
      frameVertices[fvPos + 3] = eX
      frameVertices[fvPos + 4] = dY
      frameVertices[fvPos + 5] = mZ
      // Q
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = cX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = dY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = mZ
      // T
      frameVertices[fvPos + 15] = aX
      frameVertices[fvPos + 16] = aY
      frameVertices[fvPos + 17] = mZ

      fvPos += 18

      // Q
      frameVertices[fvPos] = frameVertices[fvPos + 9] = cX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = dY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = mZ
      // R
      frameVertices[fvPos + 3] = cX
      frameVertices[fvPos + 4] = bY
      frameVertices[fvPos + 5] = mZ
      // S
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = aX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = bY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = mZ
      // T
      frameVertices[fvPos + 15] = aX
      frameVertices[fvPos + 16] = aY
      frameVertices[fvPos + 17] = mZ

      fvPos += 18

      // FRAME INSIDE

      // D
      frameVertices[fvPos] = frameVertices[fvPos + 9] = cX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = dY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = aZ
      // C
      frameVertices[fvPos + 3] = cX
      frameVertices[fvPos + 4] = bY
      frameVertices[fvPos + 5] = aZ
      // R
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = cX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = bY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = mZ
      // Q
      frameVertices[fvPos + 15] = cX
      frameVertices[fvPos + 16] = dY
      frameVertices[fvPos + 17] = mZ

      fvPos += 18

      // D
      frameVertices[fvPos] = frameVertices[fvPos + 9] = cX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = dY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = aZ
      // Q
      frameVertices[fvPos + 3] = cX
      frameVertices[fvPos + 4] = dY
      frameVertices[fvPos + 5] = mZ
      // P
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = eX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = dY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = mZ
      // E
      frameVertices[fvPos + 15] = eX
      frameVertices[fvPos + 16] = dY
      frameVertices[fvPos + 17] = aZ

      fvPos += 18

      // Q
      frameVertices[fvPos] = frameVertices[fvPos + 9] = eX
      frameVertices[fvPos + 1] = frameVertices[fvPos + 10] = dY
      frameVertices[fvPos + 2] = frameVertices[fvPos + 11] = mZ
      // R
      frameVertices[fvPos + 3] = eX
      frameVertices[fvPos + 4] = bY
      frameVertices[fvPos + 5] = mZ
      // F
      frameVertices[fvPos + 6] = frameVertices[fvPos + 12] = eX
      frameVertices[fvPos + 7] = frameVertices[fvPos + 13] = bY
      frameVertices[fvPos + 8] = frameVertices[fvPos + 14] = aZ
      // E
      frameVertices[fvPos + 15] = eX
      frameVertices[fvPos + 16] = dY
      frameVertices[fvPos + 17] = aZ

      fvPos += 18


      // FRAME OFFSET SIDE FACES
      if (frameOffset>0) {
        // FRONT
        // I
        frameVertices[ fvPos ] = frameVertices[ fvPos + 9 ] = aX
        frameVertices[ fvPos + 1 ] = frameVertices[ fvPos + 10 ] = aY
        frameVertices[ fvPos + 2 ] = frameVertices[ fvPos + 11 ] = iZ
        // J
        frameVertices[ fvPos + 3 ] = aX
        frameVertices[ fvPos + 4 ] = bY
        frameVertices[ fvPos + 5 ] = iZ
        // B
        frameVertices[ fvPos + 6 ] = frameVertices[ fvPos + 12 ] = aX
        frameVertices[ fvPos + 7 ] = frameVertices[ fvPos + 13 ] = bY
        frameVertices[ fvPos + 8 ] = frameVertices[ fvPos + 14 ] = aZ
        // A
        frameVertices[ fvPos + 15 ] = aX
        frameVertices[ fvPos + 16 ] = aY
        frameVertices[ fvPos + 17 ] = aZ

        fvPos += 18

        // I
        frameVertices[ fvPos ] = frameVertices[ fvPos + 9 ] = aX
        frameVertices[ fvPos + 1 ] = frameVertices[ fvPos + 10 ] = aY
        frameVertices[ fvPos + 2 ] = frameVertices[ fvPos + 11 ] = iZ
        // A
        frameVertices[ fvPos + 3 ] = aX
        frameVertices[ fvPos + 4 ] = aY
        frameVertices[ fvPos + 5 ] = aZ
        // H
        frameVertices[ fvPos + 6 ] = frameVertices[ fvPos + 12 ] = gX
        frameVertices[ fvPos + 7 ] = frameVertices[ fvPos + 13 ] = aY
        frameVertices[ fvPos + 8 ] = frameVertices[ fvPos + 14 ] = aZ
        // L
        frameVertices[ fvPos + 15 ] = gX
        frameVertices[ fvPos + 16 ] = aY
        frameVertices[ fvPos + 17 ] = iZ

        fvPos += 18

        // H
        frameVertices[ fvPos ] = frameVertices[ fvPos + 9 ] = gX
        frameVertices[ fvPos + 1 ] = frameVertices[ fvPos + 10 ] = aY
        frameVertices[ fvPos + 2 ] = frameVertices[ fvPos + 11 ] = aZ
        // G
        frameVertices[ fvPos + 3 ] = gX
        frameVertices[ fvPos + 4 ] = bY
        frameVertices[ fvPos + 5 ] = aZ
        // K
        frameVertices[ fvPos + 6 ] = frameVertices[ fvPos + 12 ] = gX
        frameVertices[ fvPos + 7 ] = frameVertices[ fvPos + 13 ] = bY
        frameVertices[ fvPos + 8 ] = frameVertices[ fvPos + 14 ] = iZ
        // L
        frameVertices[ fvPos + 15 ] = gX
        frameVertices[ fvPos + 16 ] = aY
        frameVertices[ fvPos + 17 ] = iZ

        fvPos += 18

        // BACK

        // U
        frameVertices[ fvPos ] = frameVertices[ fvPos + 9 ] = gX
        frameVertices[ fvPos + 1 ] = frameVertices[ fvPos + 10 ] = aY
        frameVertices[ fvPos + 2 ] = frameVertices[ fvPos + 11 ] = uZ
        // V
        frameVertices[ fvPos + 3 ] = gX
        frameVertices[ fvPos + 4 ] = bY
        frameVertices[ fvPos + 5 ] = uZ
        // N
        frameVertices[ fvPos + 6 ] = frameVertices[ fvPos + 12 ] = gX
        frameVertices[ fvPos + 7 ] = frameVertices[ fvPos + 13 ] = bY
        frameVertices[ fvPos + 8 ] = frameVertices[ fvPos + 14 ] = mZ
        // M
        frameVertices[ fvPos + 15 ] = gX
        frameVertices[ fvPos + 16 ] = aY
        frameVertices[ fvPos + 17 ] = mZ

        fvPos += 18

        // U
        frameVertices[ fvPos ] = frameVertices[ fvPos + 9 ] = gX
        frameVertices[ fvPos + 1 ] = frameVertices[ fvPos + 10 ] = aY
        frameVertices[ fvPos + 2 ] = frameVertices[ fvPos + 11 ] = uZ
        // M
        frameVertices[ fvPos + 3 ] = gX
        frameVertices[ fvPos + 4 ] = aY
        frameVertices[ fvPos + 5 ] = mZ
        // T
        frameVertices[ fvPos + 6 ] = frameVertices[ fvPos + 12 ] = aX
        frameVertices[ fvPos + 7 ] = frameVertices[ fvPos + 13 ] = aY
        frameVertices[ fvPos + 8 ] = frameVertices[ fvPos + 14 ] = mZ
        // X
        frameVertices[ fvPos + 15 ] = aX
        frameVertices[ fvPos + 16 ] = aY
        frameVertices[ fvPos + 17 ] = uZ

        fvPos += 18

        // T
        frameVertices[ fvPos ] = frameVertices[ fvPos + 9 ] = aX
        frameVertices[ fvPos + 1 ] = frameVertices[ fvPos + 10 ] = aY
        frameVertices[ fvPos + 2 ] = frameVertices[ fvPos + 11 ] = mZ
        // S
        frameVertices[ fvPos + 3 ] = aX
        frameVertices[ fvPos + 4 ] = bY
        frameVertices[ fvPos + 5 ] = mZ
        // W
        frameVertices[ fvPos + 6 ] = frameVertices[ fvPos + 12 ] = aX
        frameVertices[ fvPos + 7 ] = frameVertices[ fvPos + 13 ] = bY
        frameVertices[ fvPos + 8 ] = frameVertices[ fvPos + 14 ] = uZ
        // X
        frameVertices[ fvPos + 15 ] = aX
        frameVertices[ fvPos + 16 ] = aY
        frameVertices[ fvPos + 17 ] = uZ

      }
    }

    // LEAF + HANDLE CREATION depending on Door Type
    for (var c = 0;c<leaf.length;c++){

      // set start position in leaf vertex array for current door leaf
      lvs = leafVertices.length

      // set Leaf Length
      leafLength = leaf[c].leafLength

      prevLeafs = 0
      if ( c>1) prevLeafs = leaf[c-1].leafLength+leaf[c-2].leafLength
      else if (c>0) prevLeafs = leaf[c-1].leafLength

      // Vertex Front View
      // A/H____D/E
      //  |      |
      //  |      |
      // B/G____C/F

      aX = xCursor + frameLength// + leafGap
      aY = a.h - frameLength
      aZ = wallBackPos + a.leafWidth - leafOffset - frameOffset
      bY = leafGap
      cX = xCursor + frameLength + leafLength//-leafGap
      eZ = wallBackPos-leafOffset-frameOffset

      // door leaf front ABCD
      leafVertices[lvPos] = leafVertices[lvPos + 3] = leafVertices[lvPos + 9] = aX
      leafVertices[lvPos + 1] = leafVertices[lvPos + 10] = leafVertices[lvPos + 16] = aY
      leafVertices[lvPos + 2] = leafVertices[lvPos + 5] = leafVertices[lvPos + 11] = aZ
      leafVertices[lvPos + 4] = leafVertices[lvPos + 7] = leafVertices[lvPos + 13] = bY
      leafVertices[lvPos + 6] = leafVertices[lvPos + 12] = leafVertices[lvPos + 15] = cX
      leafVertices[lvPos + 8] = leafVertices[lvPos + 14] = leafVertices[lvPos + 17] = aZ

      // UV Mapping depending on Door Configuration
      if (a.hinge==='left') leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = xCursor/doorOpening
      else leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = -xCursor/doorOpening
      leafUvs [lvUvPos + 1] = leafUvs [lvUvPos + 7] = leafUvs [lvUvPos + 11] = 1
      leafUvs [lvUvPos + 3] = leafUvs [lvUvPos + 5] = leafUvs [lvUvPos + 9] = 0
      if (a.hinge==='left')leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = (xCursor+leafLength)/doorOpening
      else leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = -(xCursor+leafLength)/doorOpening

      lvPos += 18
      lvUvPos += 12

      // door leaf back EFGH
      leafVertices[lvPos] = leafVertices[lvPos + 3] = leafVertices[lvPos + 9] = cX
      leafVertices[lvPos + 1] = leafVertices[lvPos + 10] = leafVertices[lvPos + 16] = aY
      leafVertices[lvPos + 2] = leafVertices[lvPos + 5] = leafVertices[lvPos + 11] = eZ
      leafVertices[lvPos + 4] = leafVertices[lvPos + 7] = leafVertices[lvPos + 13] = bY
      leafVertices[lvPos + 6] = leafVertices[lvPos + 12] = leafVertices[lvPos + 15] = aX
      leafVertices[lvPos + 8] = leafVertices[lvPos + 14] = leafVertices[lvPos + 17] = eZ

      // UV Mapping depending on Door Configuration
      if (a.hinge==='right') leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = -xCursor/doorOpening
      else leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = xCursor/doorOpening
      leafUvs [lvUvPos + 1] = leafUvs [lvUvPos + 7] = leafUvs [lvUvPos + 11] = 1
      leafUvs [lvUvPos + 3] = leafUvs [lvUvPos + 5] = leafUvs [lvUvPos + 9] = 0
      if (a.hinge==='right') leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = -(xCursor+leafLength)/doorOpening
      else leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = (xCursor+leafLength)/doorOpening

      lvPos += 18
      lvUvPos += 12

      // door leaf extrusion top HADE
      // H
      leafVertices[ lvPos ] = leafVertices[ lvPos + 9 ] = aX
      leafVertices[ lvPos + 1 ] = leafVertices[ lvPos + 10 ] = aY
      leafVertices[ lvPos + 2 ] = leafVertices[ lvPos + 11 ] = eZ
      // A
      leafVertices[ lvPos + 3 ] = aX
      leafVertices[ lvPos + 4 ] = aY
      leafVertices[ lvPos + 5 ] = aZ
      // D
      leafVertices[ lvPos + 6 ] = leafVertices[ lvPos + 12 ] = cX
      leafVertices[ lvPos + 7 ] = leafVertices[ lvPos + 13 ] = aY
      leafVertices[ lvPos + 8 ] = leafVertices[ lvPos + 14 ] = aZ
      // E
      leafVertices[ lvPos + 15 ] = cX
      leafVertices[ lvPos + 16 ] = aY
      leafVertices[ lvPos + 17 ] = eZ

      leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = 0
      leafUvs [lvUvPos + 1] = leafUvs [lvUvPos + 7] = leafUvs [lvUvPos + 11] = 1
      leafUvs [lvUvPos + 3] = leafUvs [lvUvPos + 5] = leafUvs [lvUvPos + 9] = 0
      leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = 0.05

      lvPos += 18
      lvUvPos += 12

      // door leaf extrusion outer side DCFE
      // D
      leafVertices[ lvPos ] = leafVertices[ lvPos + 9 ] = cX
      leafVertices[ lvPos + 1 ] = leafVertices[ lvPos + 10 ] = aY
      leafVertices[ lvPos + 2 ] = leafVertices[ lvPos + 11 ] = aZ
      // C
      leafVertices[ lvPos + 3 ] = cX
      leafVertices[ lvPos + 4 ] = bY
      leafVertices[ lvPos + 5 ] = aZ
      // F
      leafVertices[ lvPos + 6 ] = leafVertices[ lvPos + 12 ] = cX
      leafVertices[ lvPos + 7 ] = leafVertices[ lvPos + 13 ] = bY
      leafVertices[ lvPos + 8 ] = leafVertices[ lvPos + 14 ] = eZ
      // E
      leafVertices[ lvPos + 15 ] = cX
      leafVertices[ lvPos + 16 ] = aY
      leafVertices[ lvPos + 17 ] = eZ

      leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = 0
      leafUvs [lvUvPos + 1] = leafUvs [lvUvPos + 7] = leafUvs [lvUvPos + 11] = 1
      leafUvs [lvUvPos + 3] = leafUvs [lvUvPos + 5] = leafUvs [lvUvPos + 9] = 0
      leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = 0.05

      lvPos += 18
      lvUvPos += 12

      // door leaf extrusion inner side HGBA
      // H
      leafVertices[ lvPos ] = leafVertices[ lvPos + 9 ] = aX
      leafVertices[ lvPos + 1 ] = leafVertices[ lvPos + 10 ] = aY
      leafVertices[ lvPos + 2 ] = leafVertices[ lvPos + 11 ] = eZ
      // G
      leafVertices[ lvPos + 3 ] = aX
      leafVertices[ lvPos + 4 ] = bY
      leafVertices[ lvPos + 5 ] = eZ
      // B
      leafVertices[ lvPos + 6 ] = leafVertices[ lvPos + 12 ] = aX
      leafVertices[ lvPos + 7 ] = leafVertices[ lvPos + 13 ] = bY
      leafVertices[ lvPos + 8 ] = leafVertices[ lvPos + 14 ] = aZ
      // A
      leafVertices[ lvPos + 15 ] = aX
      leafVertices[ lvPos + 16 ] = aY
      leafVertices[ lvPos + 17 ] = aZ

      leafUvs [lvUvPos] = leafUvs [lvUvPos + 2] = leafUvs [lvUvPos + 6] = 0
      leafUvs [lvUvPos + 1] = leafUvs [lvUvPos + 7] = leafUvs [lvUvPos + 11] = 1
      leafUvs [lvUvPos + 3] = leafUvs [lvUvPos + 5] = leafUvs [lvUvPos + 9] = 0
      leafUvs [lvUvPos + 4] = leafUvs [lvUvPos + 8] = leafUvs [lvUvPos + 10] = 0.05

      lvPos += 18
      lvUvPos += 12

      // set end position in leaf vertex array for current door leaf
      lve = leafVertices.length

      if (leaf[c].handle){
        // DOOR HANDLE
        //
        // Top View:
        //
        //          I/J__K/L
        //           |    |
        // E/F______G/H   |
        //  |             |
        // A/B___________C/D

        // Size Definitions

        zCursor = wallBackPos-leafOffset-frameOffset
        aX = xCursor + frameLength + leafLength-handleDistance-handleLength
        aY = handleHeight
        aZ = zCursor+a.leafWidth+handleWidth+handleThickness*0.6
        bY = handleHeight-handleThickness
        cX = xCursor + frameLength + leafLength-handleDistance
        cZ = zCursor+a.leafWidth+handleWidth+handleThickness
        eZ = zCursor+a.leafWidth+handleWidth
        gX = xCursor + frameLength + leafLength-handleDistance-handleThickness
        iZ = zCursor+a.leafWidth

        var l
        // set start position in handle vertex array for current door leaf
        hvs = handleVertices.length
        if (a.handleType==='knob') {
          handleVertices = handleVertices.concat([0.025203,-0.091811,-1.094472e-08,0.025203,-0.091811,0.007999989,0.0265,-0.1,0.007999988,0.0025,-0.099188,0.007999988,0.0025,-0.1,0.007999988,0.0265,-0.1,0.007999988,0.025203,-0.091811,-1.094472e-08,0.021439,-0.084424,-1.006412e-08,0.021439,-0.084424,0.00799999,0.015576,-0.078561,-9.365201e-09,0.015576,-0.078561,0.007999991,0.021439,-0.084424,0.00799999,0.008189,-0.074797,-8.916497e-09,0.008189,-0.074797,0.007999991,0.015576,-0.078561,0.007999991,0,-0.0735,0.007999992,0.008189,-0.074797,0.007999991,0.008189,-0.074797,-8.916497e-09,0.0025,-0.0875,0.00799999,0.0025,-0.092306,0.007999989,0.008189,-0.074797,0.007999991,-0.008189,-0.074797,-8.916497e-09,-0.008189,-0.074797,0.007999991,0,-0.0735,0.007999992,-0.015576,-0.078561,0.007999991,-0.008189,-0.074797,0.007999991,-0.008189,-0.074797,-8.916497e-09,-0.021439,-0.084424,0.00799999,-0.015576,-0.078561,0.007999991,-0.015576,-0.078561,-9.365201e-09,-0.025203,-0.091811,0.007999989,-0.021439,-0.084424,0.00799999,-0.021439,-0.084424,-1.006412e-08,-0.0025,-0.098184,0.007999988,-0.021439,-0.084424,0.00799999,-0.025203,-0.091811,0.007999989,-0.0265,-0.1,0.007999988,-0.025203,-0.091811,0.007999989,-0.025203,-0.091811,-1.094472e-08,-0.025203,-0.108189,0.007999987,-0.0265,-0.1,0.007999988,-0.0265,-0.1,-1.192093e-08,-0.021439,-0.115576,0.007999986,-0.025203,-0.108189,0.007999987,-0.025203,-0.108189,-1.289713e-08,-0.0025,-0.101816,0.007999988,-0.0025,-0.100812,0.007999988,-0.025203,-0.108189,0.007999987,-0.015576,-0.121439,0.007999985,-0.021439,-0.115576,0.007999986,-0.021439,-0.115576,-1.377773e-08,-0.008189,-0.125203,0.007999985,-0.015576,-0.121439,0.007999985,-0.015576,-0.121439,-1.447666e-08,0,-0.1265,0.007999985,-0.008189,-0.125203,0.007999985,-0.008189,-0.125203,-1.492536e-08,0.008189,-0.125203,0.007999985,0,-0.1265,0.007999985,0,-0.1265,-1.507997e-08,0.0025,-0.1125,0.007999987,0,-0.1125,0.007999987,0,-0.1265,0.007999985,0.008189,-0.125203,0.007999985,0.0025,-0.107694,0.007999987,0.0025,-0.1125,0.007999987,0.015576,-0.121439,0.007999985,0.008189,-0.125203,0.007999985,0.008189,-0.125203,-1.492536e-08,0.0025,-0.107694,0.007999987,0.008189,-0.125203,0.007999985,0.015576,-0.121439,0.007999985,0.021439,-0.115576,0.007999986,0.015576,-0.121439,0.007999985,0.015576,-0.121439,-1.447666e-08,0.025203,-0.108189,0.007999987,0.021439,-0.115576,0.007999986,0.021439,-0.115576,-1.377773e-08,0.0265,-0.1,0.007999988,0.025203,-0.108189,0.007999987,0.025203,-0.108189,-1.289713e-08,-0.021439,-0.115576,0.007999986,-0.015576,-0.121439,0.007999985,-0.0025,-0.103441,0.007999988,0.0025,-0.098184,0.007999988,0.0025,-0.099188,0.007999988,0.025203,-0.091811,0.007999989,-0.0025,-0.100812,0.007999988,-0.0025,-0.1,0.007999988,-0.0265,-0.1,0.007999988,-0.008189,-0.074797,0.007999991,-0.0025,-0.092306,0.007999989,-0.0025,-0.0875,0.00799999,-0.015576,-0.121439,0.007999985,-0.008189,-0.125203,0.007999985,-0.0025,-0.107694,0.007999987,-0.0025,-0.096559,0.007999989,-0.015576,-0.078561,0.007999991,-0.021439,-0.084424,0.00799999,-0.0265,-0.1,0.007999988,-0.0025,-0.1,0.007999988,-0.0025,-0.099188,0.007999988,-0.0025,-0.0875,0.00799999,0,-0.0875,0.00799999,0,-0.0735,0.007999992,-0.0025,-0.092306,0.007999989,-0.008189,-0.074797,0.007999991,-0.015576,-0.078561,0.007999991,-0.0025,-0.1125,0.0008419866,0.0025,-0.1125,0.0008419866,0.0025,-0.0875,0.0008419896,0,-0.1125,0.007999987,0.0025,-0.1125,0.007999987,0.0025,-0.1125,0.0008419866,0.0025,-0.101816,0.007999988,0.021439,-0.115576,0.007999986,0.025203,-0.108189,0.007999987,-0.0025,-0.1125,0.007999987,-0.0025,-0.107694,0.007999987,-0.008189,-0.125203,0.007999985,0.0025,-0.1,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.100812,0.007999988,-0.0025,-0.0875,0.0008419896,-0.0025,-0.098184,0.007999988,-0.0025,-0.099188,0.007999988,0.0265,-0.1,0.007999988,0.0025,-0.1,0.007999988,0.0025,-0.100812,0.007999988,0,-0.0875,0.00799999,-0.0025,-0.0875,0.00799999,-0.0025,-0.0875,0.0008419896,0,-0.1265,0.007999985,0,-0.1125,0.007999987,-0.0025,-0.1125,0.007999987,0.0025,-0.103441,0.007999988,0.015576,-0.121439,0.007999985,0.021439,-0.115576,0.007999986,0,-0.0735,0.007999992,0,-0.0875,0.00799999,0.0025,-0.0875,0.00799999,0.021439,-0.084424,0.00799999,0.015576,-0.078561,0.007999991,0.0025,-0.096559,0.007999989,0.015576,-0.078561,0.007999991,0.008189,-0.074797,0.007999991,0.0025,-0.092306,0.007999989,-0.010141,0.024483,0.033,0,0.0265,0.033,0,0.009999997,0.033,0.0265,-4.53789e-09,0.049,0.024483,-0.010141,0.049,0.024483,-0.010141,0.033,-0.010141,-0.024483,0.033,-0.018738,-0.018738,0.033,-0.007071,-0.007071002,0.033,0,-0.0265,0.033,0,-0.0265,0.049,-0.010141,-0.024483,0.049,-0.007071,-0.007071002,0.033,-0.018738,-0.018738,0.033,-0.024483,-0.010141,0.033,-0.024483,-0.010141,0.033,-0.0265,-2.630541e-09,0.033,-0.01,-2.630541e-09,0.033,0.010141,0.024483,0.033,0.018738,0.018738,0.033,0.007071,0.007070998,0.033,0,0.009999997,0.033,0,0.0265,0.033,0.010141,0.024483,0.033,0.018738,0.018738,0.04900001,0,-4.53789e-09,0.049,0.024483,0.010141,0.049,0.010141,0.024483,0.04900001,0,-4.53789e-09,0.049,0.018738,0.018738,0.04900001,0.024483,-0.010141,0.033,0.024483,-0.010141,0.049,0.018738,-0.018738,0.049,-0.024483,0.010141,0.049,-0.018738,0.018738,0.04900001,-0.018738,0.018738,0.033,-0.0265,-2.630541e-09,0.033,-0.0265,-4.53789e-09,0.049,-0.024483,0.010141,0.049,0.024483,-0.010141,0.033,0.018738,-0.018738,0.033,0.007071,-0.007071002,0.033,-0.018738,-0.018738,0.049,0,-4.53789e-09,0.049,-0.024483,-0.010141,0.049,-0.010141,-0.024483,0.049,0,-4.53789e-09,0.049,-0.018738,-0.018738,0.049,0,-0.01,0.033,0,-0.0265,0.033,-0.010141,-0.024483,0.033,0,-0.0265,0.049,0,-4.53789e-09,0.049,-0.010141,-0.024483,0.049,0.0265,-4.53789e-09,0.049,0,-4.53789e-09,0.049,0.024483,-0.010141,0.049,-0.024483,0.010141,0.033,-0.007071,0.007070998,0.033,-0.01,-2.630541e-09,0.033,0.010141,-0.024483,0.049,0,-0.0265,0.049,0,-0.0265,0.033,-0.024483,0.010141,0.033,-0.018738,0.018738,0.033,-0.007071,0.007070998,0.033,-0.010141,0.024483,0.033,0,0.009999997,0.033,-0.007071,0.007070998,0.033,0.010141,-0.024483,0.049,0,-4.53789e-09,0.049,0,-0.0265,0.049,0.024483,0.010141,0.049,0.0265,-4.53789e-09,0.049,0.0265,-2.630541e-09,0.033,0.024483,0.010141,0.049,0,-4.53789e-09,0.049,0.0265,-4.53789e-09,0.049,0.018738,-0.018738,0.049,0.010141,-0.024483,0.049,0.010141,-0.024483,0.033,0.018738,0.018738,0.033,0.018738,0.018738,0.04900001,0.024483,0.010141,0.049,0.018738,-0.018738,0.049,0,-4.53789e-09,0.049,0.010141,-0.024483,0.049,0.010141,0.024483,0.04900001,0.018738,0.018738,0.04900001,0.018738,0.018738,0.033,0,0.0265,0.04900001,0.010141,0.024483,0.04900001,0.010141,0.024483,0.033,0,0.0265,0.04900001,0,-4.53789e-09,0.049,0.010141,0.024483,0.04900001,0.024483,-0.010141,0.049,0,-4.53789e-09,0.049,0.018738,-0.018738,0.049,-0.010141,0.024483,0.04900001,0,0.0265,0.04900001,0,0.0265,0.033,-0.010141,0.024483,0.04900001,0,-4.53789e-09,0.049,0,0.0265,0.04900001,0.007071,0.007070998,0.033,0.018738,0.018738,0.033,0.024483,0.010141,0.033,-0.010141,0.024483,0.033,-0.018738,0.018738,0.033,-0.018738,0.018738,0.04900001,-0.018738,0.018738,0.04900001,0,-4.53789e-09,0.049,-0.010141,0.024483,0.04900001,0.024483,0.010141,0.033,0.0265,-2.630541e-09,0.033,0.01,-2.630541e-09,0.033,-0.024483,0.010141,0.049,0,-4.53789e-09,0.049,-0.018738,0.018738,0.04900001,0.01,-2.630541e-09,0.033,0.0265,-2.630541e-09,0.033,0.024483,-0.010141,0.033,-0.0265,-4.53789e-09,0.049,0,-4.53789e-09,0.049,-0.024483,0.010141,0.049,-0.024483,-0.010141,0.033,-0.024483,-0.010141,0.049,-0.0265,-4.53789e-09,0.049,-0.024483,-0.010141,0.049,0,-4.53789e-09,0.049,-0.0265,-4.53789e-09,0.049,0.007071,-0.007071002,0.033,0.018738,-0.018738,0.033,0.010141,-0.024483,0.033,-0.018738,-0.018738,0.049,-0.024483,-0.010141,0.049,-0.024483,-0.010141,0.033,0.010141,-0.024483,0.033,0,-0.0265,0.033,0,-0.01,0.033,-0.010141,-0.024483,0.049,-0.018738,-0.018738,0.049,-0.018738,-0.018738,0.033,0.025203,0.008188999,0.008000001,0.0265,-9.536744e-10,0.008,0.0265,0,0,0.021439,0.015576,0.008000002,0.025203,0.008188999,0.008000001,0.025203,0.008189,9.762049e-10,0.007071,0.007071001,0.008000001,0.01,-9.536744e-10,0.008,0.025203,0.008188999,0.008000001,0.015576,0.021439,0.008000003,0.021439,0.015576,0.008000002,0.021439,0.015576,1.856804e-09,0.008189,0.025203,0.008000003,0.015576,0.021439,0.008000003,0.015576,0.021439,2.555728e-09,0,0.0265,0.008000003,0.008189,0.025203,0.008000003,0.008189,0.025203,3.004432e-09,-0.008189,0.025203,0.008000003,0,0.0265,0.008000003,0,0.0265,3.159046e-09,-0.015576,0.021439,0.008000003,-0.008189,0.025203,0.008000003,-0.008189,0.025203,3.004432e-09,-0.021439,0.015576,0.008000002,-0.015576,0.021439,0.008000003,-0.015576,0.021439,2.555728e-09,-0.025203,0.008188999,0.008000001,-0.021439,0.015576,0.008000002,-0.021439,0.015576,1.856804e-09,-0.0265,0,0,-0.0265,-9.536744e-10,0.008,-0.025203,0.008188999,0.008000001,-0.025203,-0.008189001,0.007999999,-0.0265,-9.536744e-10,0.008,-0.0265,0,0,-0.021439,-0.015576,0.007999999,-0.025203,-0.008189001,0.007999999,-0.025203,-0.008189,-9.762049e-10,-0.015576,-0.021439,0.007999998,-0.021439,-0.015576,0.007999999,-0.021439,-0.015576,-1.856804e-09,-0.008189,-0.025203,0.007999998,-0.015576,-0.021439,0.007999998,-0.015576,-0.021439,-2.555728e-09,0,-0.0265,0.007999998,-0.008189,-0.025203,0.007999998,-0.008189,-0.025203,-3.004432e-09,0.008189,-0.025203,0.007999998,0,-0.0265,0.007999998,0,-0.0265,-3.159046e-09,0.015576,-0.021439,0.007999998,0.008189,-0.025203,0.007999998,0.008189,-0.025203,-3.004432e-09,0.021439,-0.015576,-1.856804e-09,0.021439,-0.015576,0.007999999,0.015576,-0.021439,0.007999998,0.025203,-0.008189001,0.007999999,0.021439,-0.015576,0.007999999,0.021439,-0.015576,-1.856804e-09,0.0265,-9.536744e-10,0.008,0.025203,-0.008189001,0.007999999,0.025203,-0.008189,-9.762049e-10,0.007071,0.007070998,0.033,0.01,-2.630541e-09,0.033,0.01,-9.536744e-10,0.008,0,0.009999997,0.033,0.007071,0.007070998,0.033,0.007071,0.007071001,0.008000001,-0.007071,0.007071,0.008,-0.007071,0.007070998,0.033,0,0.009999997,0.033,-0.01,-2.630541e-09,0.033,-0.007071,0.007070998,0.033,-0.007071,0.007071,0.008,-0.007071,-0.007071002,0.033,-0.01,-2.630541e-09,0.033,-0.01,-1.186505e-09,0.008,0,-0.01,0.007999999,0,-0.01,0.033,-0.007071,-0.007071002,0.033,0.007071,-0.007071,0.007999999,0.007071,-0.007071002,0.033,0,-0.01,0.033,0.01,-9.536744e-10,0.008,0.01,-2.630541e-09,0.033,0.007071,-0.007071002,0.033,0.0265,-9.536744e-10,0.008,0.025203,0.008188999,0.008000001,0.01,-9.536744e-10,0.008,0.021439,0.015576,0.008000002,0.015576,0.021439,0.008000003,0.007071,0.007071001,0.008000001,0.008189,0.025203,0.008000003,0,0.01,0.008000001,0.007071,0.007071001,0.008000001,0.008189,0.025203,0.008000003,0,0.0265,0.008000003,0,0.01,0.008000001,-0.008189,0.025203,0.008000003,-0.007071,0.007071,0.008,0,0.01,0.008000001,-0.008189,0.025203,0.008000003,-0.015576,0.021439,0.008000003,-0.007071,0.007071,0.008,-0.021439,0.015576,0.008000002,-0.007071,0.007071,0.008,-0.015576,0.021439,0.008000003,-0.025203,0.008188999,0.008000001,-0.01,-1.186505e-09,0.008,-0.007071,0.007071,0.008,-0.0265,-9.536744e-10,0.008,-0.01,-1.186505e-09,0.008,-0.025203,0.008188999,0.008000001,-0.025203,-0.008189001,0.007999999,-0.007071,-0.007071,0.007999999,-0.01,-1.186505e-09,0.008,-0.021439,-0.015576,0.007999999,-0.007071,-0.007071,0.007999999,-0.025203,-0.008189001,0.007999999,-0.021439,-0.015576,0.007999999,-0.015576,-0.021439,0.007999998,-0.007071,-0.007071,0.007999999,-0.008189,-0.025203,0.007999998,0,-0.01,0.007999999,-0.007071,-0.007071,0.007999999,-0.008189,-0.025203,0.007999998,0,-0.0265,0.007999998,0,-0.01,0.007999999,0.008189,-0.025203,0.007999998,0,-0.01,0.007999999,0,-0.0265,0.007999998,0.008189,-0.025203,0.007999998,0.015576,-0.021439,0.007999998,0.007071,-0.007071,0.007999999,0.021439,-0.015576,0.007999999,0.007071,-0.007071,0.007999999,0.015576,-0.021439,0.007999998,0.021439,-0.015576,0.007999999,0.025203,-0.008189001,0.007999999,0.007071,-0.007071,0.007999999,0.01,-9.536744e-10,0.008,0.007071,-0.007071,0.007999999,0.025203,-0.008189001,0.007999999,0.0265,-0.1,-1.192093e-08,0.025203,-0.091811,-1.094472e-08,0.0265,-0.1,0.007999988,0.025203,-0.091811,0.007999989,0.0025,-0.099188,0.007999988,0.0265,-0.1,0.007999988,0.025203,-0.091811,0.007999989,0.025203,-0.091811,-1.094472e-08,0.021439,-0.084424,0.00799999,0.021439,-0.084424,-1.006412e-08,0.015576,-0.078561,-9.365201e-09,0.021439,-0.084424,0.00799999,0.015576,-0.078561,-9.365201e-09,0.008189,-0.074797,-8.916497e-09,0.015576,-0.078561,0.007999991,0,-0.0735,-8.761883e-09,0,-0.0735,0.007999992,0.008189,-0.074797,-8.916497e-09,0,-0.0735,-8.761883e-09,-0.008189,-0.074797,-8.916497e-09,0,-0.0735,0.007999992,-0.015576,-0.078561,-9.365201e-09,-0.015576,-0.078561,0.007999991,-0.008189,-0.074797,-8.916497e-09,-0.021439,-0.084424,-1.006412e-08,-0.021439,-0.084424,0.00799999,-0.015576,-0.078561,-9.365201e-09,-0.025203,-0.091811,-1.094472e-08,-0.025203,-0.091811,0.007999989,-0.021439,-0.084424,-1.006412e-08,-0.0025,-0.099188,0.007999988,-0.0025,-0.098184,0.007999988,-0.025203,-0.091811,0.007999989,-0.0265,-0.1,-1.192093e-08,-0.0265,-0.1,0.007999988,-0.025203,-0.091811,-1.094472e-08,-0.025203,-0.108189,-1.289713e-08,-0.025203,-0.108189,0.007999987,-0.0265,-0.1,-1.192093e-08,-0.021439,-0.115576,-1.377773e-08,-0.021439,-0.115576,0.007999986,-0.025203,-0.108189,-1.289713e-08,-0.021439,-0.115576,0.007999986,-0.0025,-0.101816,0.007999988,-0.025203,-0.108189,0.007999987,-0.015576,-0.121439,-1.447666e-08,-0.015576,-0.121439,0.007999985,-0.021439,-0.115576,-1.377773e-08,-0.008189,-0.125203,-1.492536e-08,-0.008189,-0.125203,0.007999985,-0.015576,-0.121439,-1.447666e-08,0,-0.1265,-1.507997e-08,0,-0.1265,0.007999985,-0.008189,-0.125203,-1.492536e-08,0.008189,-0.125203,-1.492536e-08,0.008189,-0.125203,0.007999985,0,-0.1265,-1.507997e-08,0.008189,-0.125203,0.007999985,0.0025,-0.1125,0.007999987,0,-0.1265,0.007999985,0.015576,-0.121439,-1.447666e-08,0.015576,-0.121439,0.007999985,0.008189,-0.125203,-1.492536e-08,0.0025,-0.103441,0.007999988,0.0025,-0.107694,0.007999987,0.015576,-0.121439,0.007999985,0.021439,-0.115576,-1.377773e-08,0.021439,-0.115576,0.007999986,0.015576,-0.121439,-1.447666e-08,0.025203,-0.108189,-1.289713e-08,0.025203,-0.108189,0.007999987,0.021439,-0.115576,-1.377773e-08,0.0265,-0.1,-1.192093e-08,0.0265,-0.1,0.007999988,0.025203,-0.108189,-1.289713e-08,-0.0025,-0.101816,0.007999988,-0.021439,-0.115576,0.007999986,-0.0025,-0.103441,0.007999988,0.021439,-0.084424,0.00799999,0.0025,-0.098184,0.007999988,0.025203,-0.091811,0.007999989,-0.025203,-0.108189,0.007999987,-0.0025,-0.100812,0.007999988,-0.0265,-0.1,0.007999988,-0.0025,-0.103441,0.007999988,-0.015576,-0.121439,0.007999985,-0.0025,-0.107694,0.007999987,-0.0025,-0.098184,0.007999988,-0.0025,-0.096559,0.007999989,-0.021439,-0.084424,0.00799999,-0.025203,-0.091811,0.007999989,-0.0265,-0.1,0.007999988,-0.0025,-0.099188,0.007999988,-0.008189,-0.074797,0.007999991,-0.0025,-0.0875,0.00799999,0,-0.0735,0.007999992,-0.0025,-0.096559,0.007999989,-0.0025,-0.092306,0.007999989,-0.015576,-0.078561,0.007999991,-0.0025,-0.0875,0.0008419896,-0.0025,-0.1125,0.0008419866,0.0025,-0.0875,0.0008419896,-0.0025,-0.1125,0.0008419866,-0.0025,-0.1125,0.007999987,0,-0.1125,0.007999987,0,-0.1125,0.007999987,0.0025,-0.1125,0.0008419866,-0.0025,-0.1125,0.0008419866,0.0025,-0.100812,0.007999988,0.0025,-0.101816,0.007999988,0.025203,-0.108189,0.007999987,0.0025,-0.0875,0.0008419896,0.0025,-0.096559,0.007999989,0.0025,-0.092306,0.007999989,0.0025,-0.0875,0.0008419896,0.0025,-0.1,0.007999988,0.0025,-0.098184,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.101816,0.007999988,0.0025,-0.100812,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.1125,0.007999987,0.0025,-0.107694,0.007999987,0.0025,-0.1125,0.0008419866,0.0025,-0.103441,0.007999988,0.0025,-0.101816,0.007999988,0.0025,-0.092306,0.007999989,0.0025,-0.0875,0.00799999,0.0025,-0.0875,0.0008419896,0.0025,-0.0875,0.0008419896,0.0025,-0.1125,0.0008419866,0.0025,-0.1,0.007999988,0.0025,-0.098184,0.007999988,0.0025,-0.096559,0.007999989,0.0025,-0.0875,0.0008419896,0.0025,-0.103441,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.107694,0.007999987,-0.0025,-0.1,0.007999988,-0.0025,-0.1125,0.0008419866,-0.0025,-0.0875,0.0008419896,-0.0025,-0.1125,0.0008419866,-0.0025,-0.103441,0.007999988,-0.0025,-0.107694,0.007999987,-0.0025,-0.107694,0.007999987,-0.0025,-0.1125,0.007999987,-0.0025,-0.1125,0.0008419866,-0.0025,-0.0875,0.0008419896,-0.0025,-0.0875,0.00799999,-0.0025,-0.092306,0.007999989,-0.0025,-0.0875,0.0008419896,-0.0025,-0.096559,0.007999989,-0.0025,-0.098184,0.007999988,-0.0025,-0.0875,0.0008419896,-0.0025,-0.099188,0.007999988,-0.0025,-0.1,0.007999988,-0.0025,-0.1125,0.0008419866,-0.0025,-0.100812,0.007999988,-0.0025,-0.101816,0.007999988,-0.0025,-0.101816,0.007999988,-0.0025,-0.103441,0.007999988,-0.0025,-0.1125,0.0008419866,-0.0025,-0.0875,0.0008419896,-0.0025,-0.092306,0.007999989,-0.0025,-0.096559,0.007999989,-0.0025,-0.1125,0.0008419866,-0.0025,-0.1,0.007999988,-0.0025,-0.100812,0.007999988,0.025203,-0.108189,0.007999987,0.0265,-0.1,0.007999988,0.0025,-0.100812,0.007999988,0.0025,-0.0875,0.0008419896,0.0025,-0.0875,0.00799999,0,-0.0875,0.00799999,0,-0.0875,0.00799999,-0.0025,-0.0875,0.0008419896,0.0025,-0.0875,0.0008419896,-0.008189,-0.125203,0.007999985,0,-0.1265,0.007999985,-0.0025,-0.1125,0.007999987,0.0025,-0.101816,0.007999988,0.0025,-0.103441,0.007999988,0.021439,-0.115576,0.007999986,0.008189,-0.074797,0.007999991,0,-0.0735,0.007999992,0.0025,-0.0875,0.00799999,0.0025,-0.098184,0.007999988,0.021439,-0.084424,0.00799999,0.0025,-0.096559,0.007999989,0.0025,-0.096559,0.007999989,0.015576,-0.078561,0.007999991,0.0025,-0.092306,0.007999989,0.0265,-2.630541e-09,0.033,0.0265,-4.53789e-09,0.049,0.024483,-0.010141,0.033,-0.010141,-0.024483,0.033,0,-0.0265,0.033,-0.010141,-0.024483,0.049,-0.01,-2.630541e-09,0.033,-0.007071,-0.007071002,0.033,-0.024483,-0.010141,0.033,0.007071,0.007070998,0.033,0,0.009999997,0.033,0.010141,0.024483,0.033,0.018738,-0.018738,0.033,0.024483,-0.010141,0.033,0.018738,-0.018738,0.049,-0.024483,0.010141,0.033,-0.024483,0.010141,0.049,-0.018738,0.018738,0.033,-0.024483,0.010141,0.033,-0.0265,-2.630541e-09,0.033,-0.024483,0.010141,0.049,-0.007071,-0.007071002,0.033,0,-0.01,0.033,-0.010141,-0.024483,0.033,-0.0265,-2.630541e-09,0.033,-0.024483,0.010141,0.033,-0.01,-2.630541e-09,0.033,0.010141,-0.024483,0.033,0.010141,-0.024483,0.049,0,-0.0265,0.033,-0.018738,0.018738,0.033,-0.010141,0.024483,0.033,-0.007071,0.007070998,0.033,0.024483,0.010141,0.033,0.024483,0.010141,0.049,0.0265,-2.630541e-09,0.033,0.018738,-0.018738,0.033,0.018738,-0.018738,0.049,0.010141,-0.024483,0.033,0.024483,0.010141,0.033,0.018738,0.018738,0.033,0.024483,0.010141,0.049,0.010141,0.024483,0.033,0.010141,0.024483,0.04900001,0.018738,0.018738,0.033,0,0.0265,0.033,0,0.0265,0.04900001,0.010141,0.024483,0.033,-0.010141,0.024483,0.033,-0.010141,0.024483,0.04900001,0,0.0265,0.033,0.01,-2.630541e-09,0.033,0.007071,0.007070998,0.033,0.024483,0.010141,0.033,-0.010141,0.024483,0.04900001,-0.010141,0.024483,0.033,-0.018738,0.018738,0.04900001,0.007071,-0.007071002,0.033,0.01,-2.630541e-09,0.033,0.024483,-0.010141,0.033,-0.0265,-2.630541e-09,0.033,-0.024483,-0.010141,0.033,-0.0265,-4.53789e-09,0.049,0,-0.01,0.033,0.007071,-0.007071002,0.033,0.010141,-0.024483,0.033,-0.018738,-0.018738,0.033,-0.018738,-0.018738,0.049,-0.024483,-0.010141,0.033,-0.010141,-0.024483,0.033,-0.010141,-0.024483,0.049,-0.018738,-0.018738,0.033,0.025203,0.008189,9.762049e-10,0.025203,0.008188999,0.008000001,0.0265,0,0,0.021439,0.015576,1.856804e-09,0.021439,0.015576,0.008000002,0.025203,0.008189,9.762049e-10,0.021439,0.015576,0.008000002,0.007071,0.007071001,0.008000001,0.025203,0.008188999,0.008000001,0.015576,0.021439,2.555728e-09,0.015576,0.021439,0.008000003,0.021439,0.015576,1.856804e-09,0.008189,0.025203,3.004432e-09,0.008189,0.025203,0.008000003,0.015576,0.021439,2.555728e-09,0,0.0265,3.159046e-09,0,0.0265,0.008000003,0.008189,0.025203,3.004432e-09,-0.008189,0.025203,3.004432e-09,-0.008189,0.025203,0.008000003,0,0.0265,3.159046e-09,-0.015576,0.021439,2.555728e-09,-0.015576,0.021439,0.008000003,-0.008189,0.025203,3.004432e-09,-0.021439,0.015576,1.856804e-09,-0.021439,0.015576,0.008000002,-0.015576,0.021439,2.555728e-09,-0.025203,0.008189,9.762049e-10,-0.025203,0.008188999,0.008000001,-0.021439,0.015576,1.856804e-09,-0.025203,0.008189,9.762049e-10,-0.0265,0,0,-0.025203,0.008188999,0.008000001,-0.025203,-0.008189,-9.762049e-10,-0.025203,-0.008189001,0.007999999,-0.0265,0,0,-0.021439,-0.015576,-1.856804e-09,-0.021439,-0.015576,0.007999999,-0.025203,-0.008189,-9.762049e-10,-0.015576,-0.021439,-2.555728e-09,-0.015576,-0.021439,0.007999998,-0.021439,-0.015576,-1.856804e-09,-0.008189,-0.025203,-3.004432e-09,-0.008189,-0.025203,0.007999998,-0.015576,-0.021439,-2.555728e-09,0,-0.0265,-3.159046e-09,0,-0.0265,0.007999998,-0.008189,-0.025203,-3.004432e-09,0.008189,-0.025203,-3.004432e-09,0.008189,-0.025203,0.007999998,0,-0.0265,-3.159046e-09,0.015576,-0.021439,-2.555728e-09,0.015576,-0.021439,0.007999998,0.008189,-0.025203,-3.004432e-09,0.015576,-0.021439,-2.555728e-09,0.021439,-0.015576,-1.856804e-09,0.015576,-0.021439,0.007999998,0.025203,-0.008189,-9.762049e-10,0.025203,-0.008189001,0.007999999,0.021439,-0.015576,-1.856804e-09,0.0265,0,0,0.0265,-9.536744e-10,0.008,0.025203,-0.008189,-9.762049e-10,0.007071,0.007071001,0.008000001,0.007071,0.007070998,0.033,0.01,-9.536744e-10,0.008,0,0.01,0.008000001,0,0.009999997,0.033,0.007071,0.007071001,0.008000001,0,0.01,0.008000001,-0.007071,0.007071,0.008,0,0.009999997,0.033,-0.01,-1.186505e-09,0.008,-0.01,-2.630541e-09,0.033,-0.007071,0.007071,0.008,-0.007071,-0.007071,0.007999999,-0.007071,-0.007071002,0.033,-0.01,-1.186505e-09,0.008,-0.007071,-0.007071,0.007999999,0,-0.01,0.007999999,-0.007071,-0.007071002,0.033,0,-0.01,0.007999999,0.007071,-0.007071,0.007999999,0,-0.01,0.033,0.007071,-0.007071,0.007999999,0.01,-9.536744e-10,0.008,0.007071,-0.007071002,0.033,0.015576,0.021439,0.008000003,0.008189,0.025203,0.008000003,0.007071,0.007071001,0.008000001,0,0.0265,0.008000003,-0.008189,0.025203,0.008000003,0,0.01,0.008000001,-0.021439,0.015576,0.008000002,-0.025203,0.008188999,0.008000001,-0.007071,0.007071,0.008,-0.0265,-9.536744e-10,0.008,-0.025203,-0.008189001,0.007999999,-0.01,-1.186505e-09,0.008,-0.015576,-0.021439,0.007999998,-0.008189,-0.025203,0.007999998,-0.007071,-0.007071,0.007999999,0,-0.01,0.007999999,0.008189,-0.025203,0.007999998,0.007071,-0.007071,0.007999999,0.0265,-9.536744e-10,0.008,0.01,-9.536744e-10,0.008,0.025203,-0.008189001,0.007999999])
          for (l = hvs; l < handleVertices.length - 2; l = l + 3) {
            handleVertices[l] += cX
            handleVertices[l + 1] += aY
            handleVertices[l + 2] += iZ
          }
        } else if (a.handleType==='round') {
          handleVertices = handleVertices.concat([-0.12,0.005877995,0.04491,-0.12,-5.126e-09,0.043,-0.12,-6.318092e-09,0.053,-0.12,0.005877995,0.04491,-0.00809,0.005877995,0.04491,-0.01,-5.126e-09,0.043,-0.12,0.009510994,0.04991,-0.12,0.005877995,0.04491,-0.12,-6.318092e-09,0.053,-0.12,0.009510993,0.05609,-0.12,0.009510994,0.04991,-0.12,-6.318092e-09,0.053,-0.12,0.005877993,0.06109,-0.12,0.009510993,0.05609,-0.12,-6.318092e-09,0.053,-0.12,-7.510185e-09,0.063,-0.12,0.005877993,0.06109,-0.12,-6.318092e-09,0.053,-0.12,-0.005878008,0.06109,-0.12,-7.510185e-09,0.063,-0.12,-6.318092e-09,0.053,-0.12,-7.510185e-09,0.063,-0.12,-0.005878008,0.06109,0.00809,-0.005878008,0.06109,-0.12,-0.009511006,0.05609,-0.12,-0.005878008,0.06109,-0.12,-6.318092e-09,0.053,-0.12,-0.009511005,0.04991,-0.12,-0.009511006,0.05609,-0.12,-6.318092e-09,0.053,-0.12,-0.005878005,0.04491,-0.12,-0.009511005,0.04991,-0.12,-6.318092e-09,0.053,-0.12,-0.009511005,0.04991,-0.12,-0.005878005,0.04491,-0.00809,-0.005878005,0.04491,-0.12,-5.126e-09,0.043,-0.12,-0.005878005,0.04491,-0.12,-6.318092e-09,0.053,-0.12,-0.005878005,0.04491,-0.12,-5.126e-09,0.043,-0.01,-5.126e-09,0.043,0.00809,0.005878,0.008,0.00309,0.009511,0.008,0.00309,0.009510993,0.05609,0.00309,0.009511,0.008,-0.00309,0.009511,0.008,-0.00309,0.009510994,0.04991,-0.00809,0.005877995,0.04491,-0.12,0.005877995,0.04491,-0.12,0.009510994,0.04991,-0.00309,0.009510994,0.04991,-0.12,0.009510994,0.04991,-0.12,0.009510993,0.05609,0.00309,0.009510993,0.05609,-0.12,0.009510993,0.05609,-0.12,0.005877993,0.06109,0.00809,0.005877993,0.06109,-0.12,0.005877993,0.06109,-0.12,-7.510185e-09,0.063,-0.12,-0.005878008,0.06109,-0.12,-0.009511006,0.05609,0.00309,-0.009511006,0.05609,-0.12,-0.009511006,0.05609,-0.12,-0.009511005,0.04991,-0.00309,-0.009511005,0.04991,0.01,-1.390709e-10,0.007999999,0.00809,0.005878,0.008,0.00809,0.005877993,0.06109,-0.00309,0.009511,0.008,-0.00809,0.005878,0.008,-0.00809,0.005877995,0.04491,-0.00809,0.005878,0.008,-0.01,-1.390709e-10,0.007999999,-0.01,-5.126e-09,0.043,-0.00309,-0.009511005,0.04991,-0.00309,-0.009511,0.007999999,0.00309,-0.009511,0.007999999,0.025203,-0.091811,-1.094472e-08,0.025203,-0.091811,0.007999989,0.0265,-0.1,0.007999988,0.0025,-0.099188,0.007999988,0.0025,-0.1,0.007999988,0.0265,-0.1,0.007999988,0.025203,-0.091811,-1.094472e-08,0.021439,-0.084424,-1.006412e-08,0.021439,-0.084424,0.00799999,0.015576,-0.078561,-9.365201e-09,0.015576,-0.078561,0.007999991,0.021439,-0.084424,0.00799999,0.008189,-0.074797,-8.916497e-09,0.008189,-0.074797,0.007999991,0.015576,-0.078561,0.007999991,0,-0.0735,0.007999992,0.008189,-0.074797,0.007999991,0.008189,-0.074797,-8.916497e-09,0.0025,-0.0875,0.00799999,0.0025,-0.092306,0.007999989,0.008189,-0.074797,0.007999991,-0.008189,-0.074797,-8.916497e-09,-0.008189,-0.074797,0.007999991,0,-0.0735,0.007999992,-0.015576,-0.078561,0.007999991,-0.008189,-0.074797,0.007999991,-0.008189,-0.074797,-8.916497e-09,-0.021439,-0.084424,0.00799999,-0.015576,-0.078561,0.007999991,-0.015576,-0.078561,-9.365201e-09,-0.025203,-0.091811,0.007999989,-0.021439,-0.084424,0.00799999,-0.021439,-0.084424,-1.006412e-08,-0.0025,-0.098184,0.007999988,-0.021439,-0.084424,0.00799999,-0.025203,-0.091811,0.007999989,-0.0265,-0.1,0.007999988,-0.025203,-0.091811,0.007999989,-0.025203,-0.091811,-1.094472e-08,-0.025203,-0.108189,0.007999987,-0.0265,-0.1,0.007999988,-0.0265,-0.1,-1.192093e-08,-0.021439,-0.115576,0.007999986,-0.025203,-0.108189,0.007999987,-0.025203,-0.108189,-1.289713e-08,-0.0025,-0.101816,0.007999988,-0.0025,-0.100812,0.007999988,-0.025203,-0.108189,0.007999987,-0.015576,-0.121439,0.007999985,-0.021439,-0.115576,0.007999986,-0.021439,-0.115576,-1.377773e-08,-0.008189,-0.125203,0.007999985,-0.015576,-0.121439,0.007999985,-0.015576,-0.121439,-1.447666e-08,0,-0.1265,0.007999985,-0.008189,-0.125203,0.007999985,-0.008189,-0.125203,-1.492536e-08,0.008189,-0.125203,0.007999985,0,-0.1265,0.007999985,0,-0.1265,-1.507997e-08,0.0025,-0.1125,0.007999987,0,-0.1125,0.007999987,0,-0.1265,0.007999985,0.008189,-0.125203,0.007999985,0.0025,-0.107694,0.007999987,0.0025,-0.1125,0.007999987,0.015576,-0.121439,0.007999985,0.008189,-0.125203,0.007999985,0.008189,-0.125203,-1.492536e-08,0.0025,-0.107694,0.007999987,0.008189,-0.125203,0.007999985,0.015576,-0.121439,0.007999985,0.021439,-0.115576,0.007999986,0.015576,-0.121439,0.007999985,0.015576,-0.121439,-1.447666e-08,0.025203,-0.108189,0.007999987,0.021439,-0.115576,0.007999986,0.021439,-0.115576,-1.377773e-08,0.0265,-0.1,0.007999988,0.025203,-0.108189,0.007999987,0.025203,-0.108189,-1.289713e-08,-0.021439,-0.115576,0.007999986,-0.015576,-0.121439,0.007999985,-0.0025,-0.103441,0.007999988,0.0025,-0.098184,0.007999988,0.0025,-0.099188,0.007999988,0.025203,-0.091811,0.007999989,-0.0025,-0.100812,0.007999988,-0.0025,-0.1,0.007999988,-0.0265,-0.1,0.007999988,-0.008189,-0.074797,0.007999991,-0.0025,-0.092306,0.007999989,-0.0025,-0.0875,0.00799999,-0.015576,-0.121439,0.007999985,-0.008189,-0.125203,0.007999985,-0.0025,-0.107694,0.007999987,-0.0025,-0.096559,0.007999989,-0.015576,-0.078561,0.007999991,-0.021439,-0.084424,0.00799999,-0.0265,-0.1,0.007999988,-0.0025,-0.1,0.007999988,-0.0025,-0.099188,0.007999988,-0.0025,-0.0875,0.00799999,0,-0.0875,0.00799999,0,-0.0735,0.007999992,-0.0025,-0.092306,0.007999989,-0.008189,-0.074797,0.007999991,-0.015576,-0.078561,0.007999991,-0.0025,-0.1125,0.0008419866,0.0025,-0.1125,0.0008419866,0.0025,-0.0875,0.0008419896,0,-0.1125,0.007999987,0.0025,-0.1125,0.007999987,0.0025,-0.1125,0.0008419866,0.0025,-0.101816,0.007999988,0.021439,-0.115576,0.007999986,0.025203,-0.108189,0.007999987,-0.0025,-0.1125,0.007999987,-0.0025,-0.107694,0.007999987,-0.008189,-0.125203,0.007999985,0.0025,-0.1,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.100812,0.007999988,-0.0025,-0.0875,0.0008419896,-0.0025,-0.098184,0.007999988,-0.0025,-0.099188,0.007999988,0.0265,-0.1,0.007999988,0.0025,-0.1,0.007999988,0.0025,-0.100812,0.007999988,0,-0.0875,0.00799999,-0.0025,-0.0875,0.00799999,-0.0025,-0.0875,0.0008419896,0,-0.1265,0.007999985,0,-0.1125,0.007999987,-0.0025,-0.1125,0.007999987,0.0025,-0.103441,0.007999988,0.015576,-0.121439,0.007999985,0.021439,-0.115576,0.007999986,0,-0.0735,0.007999992,0,-0.0875,0.00799999,0.0025,-0.0875,0.00799999,0.021439,-0.084424,0.00799999,0.015576,-0.078561,0.007999991,0.0025,-0.096559,0.007999989,0.015576,-0.078561,0.007999991,0.008189,-0.074797,0.007999991,0.0025,-0.092306,0.007999989,0.025203,0.008188999,0.008000001,0.0265,-9.536744e-10,0.008,0.0265,0,0,0.021439,0.015576,0.008000002,0.025203,0.008188999,0.008000001,0.025203,0.008189,9.762049e-10,0.015576,0.021439,0.008000003,0.021439,0.015576,0.008000002,0.021439,0.015576,1.856804e-09,0.008189,0.025203,0.008000003,0.015576,0.021439,0.008000003,0.015576,0.021439,2.555728e-09,0,0.0265,0.008000003,0.008189,0.025203,0.008000003,0.008189,0.025203,3.004432e-09,-0.008189,0.025203,0.008000003,0,0.0265,0.008000003,0,0.0265,3.159046e-09,-0.015576,0.021439,0.008000003,-0.008189,0.025203,0.008000003,-0.008189,0.025203,3.004432e-09,-0.021439,0.015576,0.008000002,-0.015576,0.021439,0.008000003,-0.015576,0.021439,2.555728e-09,-0.025203,0.008188999,0.008000001,-0.021439,0.015576,0.008000002,-0.021439,0.015576,1.856804e-09,-0.0265,0,0,-0.0265,-9.536744e-10,0.008,-0.025203,0.008188999,0.008000001,-0.025203,-0.008189001,0.007999999,-0.0265,-9.536744e-10,0.008,-0.0265,0,0,-0.021439,-0.015576,0.007999999,-0.025203,-0.008189001,0.007999999,-0.025203,-0.008189,-9.762049e-10,-0.00809,-0.005878001,0.007999999,-0.009045,-0.002939001,0.008,-0.025203,-0.008189001,0.007999999,-0.015576,-0.021439,0.007999998,-0.021439,-0.015576,0.007999999,-0.021439,-0.015576,-1.856804e-09,-0.015576,-0.021439,0.007999998,-0.00559,-0.007694001,0.007999999,-0.00809,-0.005878001,0.007999999,-0.008189,-0.025203,0.007999998,-0.015576,-0.021439,0.007999998,-0.015576,-0.021439,-2.555728e-09,0,-0.0265,0.007999998,-0.008189,-0.025203,0.007999998,-0.008189,-0.025203,-3.004432e-09,0.008189,-0.025203,0.007999998,0,-0.0265,0.007999998,0,-0.0265,-3.159046e-09,0.015576,-0.021439,0.007999998,0.008189,-0.025203,0.007999998,0.008189,-0.025203,-3.004432e-09,0.021439,-0.015576,-1.856804e-09,0.021439,-0.015576,0.007999999,0.015576,-0.021439,0.007999998,0.00809,-0.005878001,0.007999999,0.00559,-0.007694001,0.007999999,0.015576,-0.021439,0.007999998,0.025203,-0.008189001,0.007999999,0.021439,-0.015576,0.007999999,0.021439,-0.015576,-1.856804e-09,0.025203,-0.008189001,0.007999999,0.009045,-0.002939001,0.008,0.00809,-0.005878001,0.007999999,0.0265,-9.536744e-10,0.008,0.025203,-0.008189001,0.007999999,0.025203,-0.008189,-9.762049e-10,-0.01,-5.126e-09,0.043,-0.01,-1.390709e-10,0.007999999,-0.00809,-0.005878001,0.007999999,-0.00809,-0.005878005,0.04491,-0.00809,-0.005878001,0.007999999,-0.00309,-0.009511,0.007999999,0.00309,-0.009511006,0.05609,0.00309,-0.009511,0.007999999,0.00809,-0.005878001,0.007999999,0.00809,-0.005878008,0.06109,0.00809,-0.005878001,0.007999999,0.01,-1.390709e-10,0.007999999,0.025203,0.008188999,0.008000001,0.009045,0.002938999,0.008,0.01,-1.390709e-10,0.007999999,0.00809,0.005878,0.008,0.009045,0.002938999,0.008,0.025203,0.008188999,0.008000001,0.015576,0.021439,0.008000003,0.00559,0.007693999,0.008000001,0.00809,0.005878,0.008,0.00309,0.009511,0.008,0.00559,0.007693999,0.008000001,0.015576,0.021439,0.008000003,0,0.0265,0.008000003,0,0.009510999,0.008000001,0.00309,0.009511,0.008,-0.00309,0.009511,0.008,0,0.009510999,0.008000001,0,0.0265,0.008000003,-0.015576,0.021439,0.008000003,-0.00559,0.007693999,0.008000001,-0.00309,0.009511,0.008,-0.00809,0.005878,0.008,-0.00559,0.007693999,0.008000001,-0.015576,0.021439,0.008000003,-0.025203,0.008188999,0.008000001,-0.009045,0.002938999,0.008,-0.00809,0.005878,0.008,-0.01,-1.390709e-10,0.007999999,-0.009045,0.002938999,0.008,-0.025203,0.008188999,0.008000001,-0.025203,-0.008189001,0.007999999,-0.009045,-0.002939001,0.008,-0.01,-1.390709e-10,0.007999999,-0.00309,-0.009511,0.007999999,-0.00559,-0.007694001,0.007999999,-0.015576,-0.021439,0.007999998,0,-0.0265,0.007999998,0,-0.009511,0.007999999,-0.00309,-0.009511,0.007999999,0.00309,-0.009511,0.007999999,0,-0.009511,0.007999999,0,-0.0265,0.007999998,0.015576,-0.021439,0.007999998,0.00559,-0.007694001,0.007999999,0.00309,-0.009511,0.007999999,0.01,-1.390709e-10,0.007999999,0.009045,-0.002939001,0.008,0.025203,-0.008189001,0.007999999,-0.12,-5.126e-09,0.043,-0.12,0.005877995,0.04491,-0.01,-5.126e-09,0.043,0.01,-7.510185e-09,0.063,-0.12,-7.510185e-09,0.063,0.00809,-0.005878008,0.06109,-0.00309,-0.009511005,0.04991,-0.12,-0.009511005,0.04991,-0.00809,-0.005878005,0.04491,-0.00809,-0.005878005,0.04491,-0.12,-0.005878005,0.04491,-0.01,-5.126e-09,0.043,0.00809,0.005877993,0.06109,0.00809,0.005878,0.008,0.00309,0.009510993,0.05609,0.00309,0.009510993,0.05609,0.00309,0.009511,0.008,-0.00309,0.009510994,0.04991,-0.00309,0.009510994,0.04991,-0.00809,0.005877995,0.04491,-0.12,0.009510994,0.04991,0.00309,0.009510993,0.05609,-0.00309,0.009510994,0.04991,-0.12,0.009510993,0.05609,0.00809,0.005877993,0.06109,0.00309,0.009510993,0.05609,-0.12,0.005877993,0.06109,0.01,-7.510185e-09,0.063,0.00809,0.005877993,0.06109,-0.12,-7.510185e-09,0.063,0.00809,-0.005878008,0.06109,-0.12,-0.005878008,0.06109,0.00309,-0.009511006,0.05609,0.00309,-0.009511006,0.05609,-0.12,-0.009511006,0.05609,-0.00309,-0.009511005,0.04991,0.01,-7.510185e-09,0.063,0.01,-1.390709e-10,0.007999999,0.00809,0.005877993,0.06109,-0.00309,0.009510994,0.04991,-0.00309,0.009511,0.008,-0.00809,0.005877995,0.04491,-0.00809,0.005877995,0.04491,-0.00809,0.005878,0.008,-0.01,-5.126e-09,0.043,0.00309,-0.009511006,0.05609,-0.00309,-0.009511005,0.04991,0.00309,-0.009511,0.007999999,0.0265,-0.1,-1.192093e-08,0.025203,-0.091811,-1.094472e-08,0.0265,-0.1,0.007999988,0.025203,-0.091811,0.007999989,0.0025,-0.099188,0.007999988,0.0265,-0.1,0.007999988,0.025203,-0.091811,0.007999989,0.025203,-0.091811,-1.094472e-08,0.021439,-0.084424,0.00799999,0.021439,-0.084424,-1.006412e-08,0.015576,-0.078561,-9.365201e-09,0.021439,-0.084424,0.00799999,0.015576,-0.078561,-9.365201e-09,0.008189,-0.074797,-8.916497e-09,0.015576,-0.078561,0.007999991,0,-0.0735,-8.761883e-09,0,-0.0735,0.007999992,0.008189,-0.074797,-8.916497e-09,0,-0.0735,-8.761883e-09,-0.008189,-0.074797,-8.916497e-09,0,-0.0735,0.007999992,-0.015576,-0.078561,-9.365201e-09,-0.015576,-0.078561,0.007999991,-0.008189,-0.074797,-8.916497e-09,-0.021439,-0.084424,-1.006412e-08,-0.021439,-0.084424,0.00799999,-0.015576,-0.078561,-9.365201e-09,-0.025203,-0.091811,-1.094472e-08,-0.025203,-0.091811,0.007999989,-0.021439,-0.084424,-1.006412e-08,-0.0025,-0.099188,0.007999988,-0.0025,-0.098184,0.007999988,-0.025203,-0.091811,0.007999989,-0.0265,-0.1,-1.192093e-08,-0.0265,-0.1,0.007999988,-0.025203,-0.091811,-1.094472e-08,-0.025203,-0.108189,-1.289713e-08,-0.025203,-0.108189,0.007999987,-0.0265,-0.1,-1.192093e-08,-0.021439,-0.115576,-1.377773e-08,-0.021439,-0.115576,0.007999986,-0.025203,-0.108189,-1.289713e-08,-0.021439,-0.115576,0.007999986,-0.0025,-0.101816,0.007999988,-0.025203,-0.108189,0.007999987,-0.015576,-0.121439,-1.447666e-08,-0.015576,-0.121439,0.007999985,-0.021439,-0.115576,-1.377773e-08,-0.008189,-0.125203,-1.492536e-08,-0.008189,-0.125203,0.007999985,-0.015576,-0.121439,-1.447666e-08,0,-0.1265,-1.507997e-08,0,-0.1265,0.007999985,-0.008189,-0.125203,-1.492536e-08,0.008189,-0.125203,-1.492536e-08,0.008189,-0.125203,0.007999985,0,-0.1265,-1.507997e-08,0.008189,-0.125203,0.007999985,0.0025,-0.1125,0.007999987,0,-0.1265,0.007999985,0.015576,-0.121439,-1.447666e-08,0.015576,-0.121439,0.007999985,0.008189,-0.125203,-1.492536e-08,0.0025,-0.103441,0.007999988,0.0025,-0.107694,0.007999987,0.015576,-0.121439,0.007999985,0.021439,-0.115576,-1.377773e-08,0.021439,-0.115576,0.007999986,0.015576,-0.121439,-1.447666e-08,0.025203,-0.108189,-1.289713e-08,0.025203,-0.108189,0.007999987,0.021439,-0.115576,-1.377773e-08,0.0265,-0.1,-1.192093e-08,0.0265,-0.1,0.007999988,0.025203,-0.108189,-1.289713e-08,-0.0025,-0.101816,0.007999988,-0.021439,-0.115576,0.007999986,-0.0025,-0.103441,0.007999988,0.021439,-0.084424,0.00799999,0.0025,-0.098184,0.007999988,0.025203,-0.091811,0.007999989,-0.025203,-0.108189,0.007999987,-0.0025,-0.100812,0.007999988,-0.0265,-0.1,0.007999988,-0.0025,-0.103441,0.007999988,-0.015576,-0.121439,0.007999985,-0.0025,-0.107694,0.007999987,-0.0025,-0.098184,0.007999988,-0.0025,-0.096559,0.007999989,-0.021439,-0.084424,0.00799999,-0.025203,-0.091811,0.007999989,-0.0265,-0.1,0.007999988,-0.0025,-0.099188,0.007999988,-0.008189,-0.074797,0.007999991,-0.0025,-0.0875,0.00799999,0,-0.0735,0.007999992,-0.0025,-0.096559,0.007999989,-0.0025,-0.092306,0.007999989,-0.015576,-0.078561,0.007999991,-0.0025,-0.0875,0.0008419896,-0.0025,-0.1125,0.0008419866,0.0025,-0.0875,0.0008419896,-0.0025,-0.1125,0.0008419866,-0.0025,-0.1125,0.007999987,0,-0.1125,0.007999987,0,-0.1125,0.007999987,0.0025,-0.1125,0.0008419866,-0.0025,-0.1125,0.0008419866,0.0025,-0.100812,0.007999988,0.0025,-0.101816,0.007999988,0.025203,-0.108189,0.007999987,0.0025,-0.0875,0.0008419896,0.0025,-0.096559,0.007999989,0.0025,-0.092306,0.007999989,0.0025,-0.0875,0.0008419896,0.0025,-0.1,0.007999988,0.0025,-0.098184,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.101816,0.007999988,0.0025,-0.100812,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.1125,0.007999987,0.0025,-0.107694,0.007999987,0.0025,-0.1125,0.0008419866,0.0025,-0.103441,0.007999988,0.0025,-0.101816,0.007999988,0.0025,-0.092306,0.007999989,0.0025,-0.0875,0.00799999,0.0025,-0.0875,0.0008419896,0.0025,-0.0875,0.0008419896,0.0025,-0.1125,0.0008419866,0.0025,-0.1,0.007999988,0.0025,-0.098184,0.007999988,0.0025,-0.096559,0.007999989,0.0025,-0.0875,0.0008419896,0.0025,-0.103441,0.007999988,0.0025,-0.1125,0.0008419866,0.0025,-0.107694,0.007999987,-0.0025,-0.1,0.007999988,-0.0025,-0.1125,0.0008419866,-0.0025,-0.0875,0.0008419896,-0.0025,-0.1125,0.0008419866,-0.0025,-0.103441,0.007999988,-0.0025,-0.107694,0.007999987,-0.0025,-0.107694,0.007999987,-0.0025,-0.1125,0.007999987,-0.0025,-0.1125,0.0008419866,-0.0025,-0.0875,0.0008419896,-0.0025,-0.0875,0.00799999,-0.0025,-0.092306,0.007999989,-0.0025,-0.0875,0.0008419896,-0.0025,-0.096559,0.007999989,-0.0025,-0.098184,0.007999988,-0.0025,-0.0875,0.0008419896,-0.0025,-0.099188,0.007999988,-0.0025,-0.1,0.007999988,-0.0025,-0.1125,0.0008419866,-0.0025,-0.100812,0.007999988,-0.0025,-0.101816,0.007999988,-0.0025,-0.101816,0.007999988,-0.0025,-0.103441,0.007999988,-0.0025,-0.1125,0.0008419866,-0.0025,-0.0875,0.0008419896,-0.0025,-0.092306,0.007999989,-0.0025,-0.096559,0.007999989,-0.0025,-0.1125,0.0008419866,-0.0025,-0.1,0.007999988,-0.0025,-0.100812,0.007999988,0.025203,-0.108189,0.007999987,0.0265,-0.1,0.007999988,0.0025,-0.100812,0.007999988,0.0025,-0.0875,0.0008419896,0.0025,-0.0875,0.00799999,0,-0.0875,0.00799999,0,-0.0875,0.00799999,-0.0025,-0.0875,0.0008419896,0.0025,-0.0875,0.0008419896,-0.008189,-0.125203,0.007999985,0,-0.1265,0.007999985,-0.0025,-0.1125,0.007999987,0.0025,-0.101816,0.007999988,0.0025,-0.103441,0.007999988,0.021439,-0.115576,0.007999986,0.008189,-0.074797,0.007999991,0,-0.0735,0.007999992,0.0025,-0.0875,0.00799999,0.0025,-0.098184,0.007999988,0.021439,-0.084424,0.00799999,0.0025,-0.096559,0.007999989,0.0025,-0.096559,0.007999989,0.015576,-0.078561,0.007999991,0.0025,-0.092306,0.007999989,0.025203,0.008189,9.762049e-10,0.025203,0.008188999,0.008000001,0.0265,0,0,0.021439,0.015576,1.856804e-09,0.021439,0.015576,0.008000002,0.025203,0.008189,9.762049e-10,0.015576,0.021439,2.555728e-09,0.015576,0.021439,0.008000003,0.021439,0.015576,1.856804e-09,0.008189,0.025203,3.004432e-09,0.008189,0.025203,0.008000003,0.015576,0.021439,2.555728e-09,0,0.0265,3.159046e-09,0,0.0265,0.008000003,0.008189,0.025203,3.004432e-09,-0.008189,0.025203,3.004432e-09,-0.008189,0.025203,0.008000003,0,0.0265,3.159046e-09,-0.015576,0.021439,2.555728e-09,-0.015576,0.021439,0.008000003,-0.008189,0.025203,3.004432e-09,-0.021439,0.015576,1.856804e-09,-0.021439,0.015576,0.008000002,-0.015576,0.021439,2.555728e-09,-0.025203,0.008189,9.762049e-10,-0.025203,0.008188999,0.008000001,-0.021439,0.015576,1.856804e-09,-0.025203,0.008189,9.762049e-10,-0.0265,0,0,-0.025203,0.008188999,0.008000001,-0.025203,-0.008189,-9.762049e-10,-0.025203,-0.008189001,0.007999999,-0.0265,0,0,-0.021439,-0.015576,-1.856804e-09,-0.021439,-0.015576,0.007999999,-0.025203,-0.008189,-9.762049e-10,-0.021439,-0.015576,0.007999999,-0.00809,-0.005878001,0.007999999,-0.025203,-0.008189001,0.007999999,-0.015576,-0.021439,-2.555728e-09,-0.015576,-0.021439,0.007999998,-0.021439,-0.015576,-1.856804e-09,-0.021439,-0.015576,0.007999999,-0.015576,-0.021439,0.007999998,-0.00809,-0.005878001,0.007999999,-0.008189,-0.025203,-3.004432e-09,-0.008189,-0.025203,0.007999998,-0.015576,-0.021439,-2.555728e-09,0,-0.0265,-3.159046e-09,0,-0.0265,0.007999998,-0.008189,-0.025203,-3.004432e-09,0.008189,-0.025203,-3.004432e-09,0.008189,-0.025203,0.007999998,0,-0.0265,-3.159046e-09,0.015576,-0.021439,-2.555728e-09,0.015576,-0.021439,0.007999998,0.008189,-0.025203,-3.004432e-09,0.015576,-0.021439,-2.555728e-09,0.021439,-0.015576,-1.856804e-09,0.015576,-0.021439,0.007999998,0.021439,-0.015576,0.007999999,0.00809,-0.005878001,0.007999999,0.015576,-0.021439,0.007999998,0.025203,-0.008189,-9.762049e-10,0.025203,-0.008189001,0.007999999,0.021439,-0.015576,-1.856804e-09,0.021439,-0.015576,0.007999999,0.025203,-0.008189001,0.007999999,0.00809,-0.005878001,0.007999999,0.0265,0,0,0.0265,-9.536744e-10,0.008,0.025203,-0.008189,-9.762049e-10,-0.00809,-0.005878005,0.04491,-0.01,-5.126e-09,0.043,-0.00809,-0.005878001,0.007999999,-0.00309,-0.009511005,0.04991,-0.00809,-0.005878005,0.04491,-0.00309,-0.009511,0.007999999,0.00809,-0.005878008,0.06109,0.00309,-0.009511006,0.05609,0.00809,-0.005878001,0.007999999,0.01,-7.510185e-09,0.063,0.00809,-0.005878008,0.06109,0.01,-1.390709e-10,0.007999999,0.0265,-9.536744e-10,0.008,0.025203,0.008188999,0.008000001,0.01,-1.390709e-10,0.007999999,0.021439,0.015576,0.008000002,0.00809,0.005878,0.008,0.025203,0.008188999,0.008000001,0.021439,0.015576,0.008000002,0.015576,0.021439,0.008000003,0.00809,0.005878,0.008,0.008189,0.025203,0.008000003,0.00309,0.009511,0.008,0.015576,0.021439,0.008000003,0.008189,0.025203,0.008000003,0,0.0265,0.008000003,0.00309,0.009511,0.008,-0.008189,0.025203,0.008000003,-0.00309,0.009511,0.008,0,0.0265,0.008000003,-0.008189,0.025203,0.008000003,-0.015576,0.021439,0.008000003,-0.00309,0.009511,0.008,-0.021439,0.015576,0.008000002,-0.00809,0.005878,0.008,-0.015576,0.021439,0.008000003,-0.021439,0.015576,0.008000002,-0.025203,0.008188999,0.008000001,-0.00809,0.005878,0.008,-0.0265,-9.536744e-10,0.008,-0.01,-1.390709e-10,0.007999999,-0.025203,0.008188999,0.008000001,-0.0265,-9.536744e-10,0.008,-0.025203,-0.008189001,0.007999999,-0.01,-1.390709e-10,0.007999999,-0.008189,-0.025203,0.007999998,-0.00309,-0.009511,0.007999999,-0.015576,-0.021439,0.007999998,-0.008189,-0.025203,0.007999998,0,-0.0265,0.007999998,-0.00309,-0.009511,0.007999999,0.008189,-0.025203,0.007999998,0.00309,-0.009511,0.007999999,0,-0.0265,0.007999998,0.008189,-0.025203,0.007999998,0.015576,-0.021439,0.007999998,0.00309,-0.009511,0.007999999,0.0265,-9.536744e-10,0.008,0.01,-1.390709e-10,0.007999999,0.025203,-0.008189001,0.007999999])
          for (l = hvs; l < handleVertices.length - 2; l = l + 3) {
            handleVertices[l] += cX
            handleVertices[l + 1] += aY
            handleVertices[l + 2] += iZ
          }
        } else if (a.handleType==='classic') {
          handleVertices = handleVertices.concat([-0.019075,0.060079,0.002000007,-0.02,0.06,0.002000007,-0.019047,-0.120065,0.001999986,0.016353,-0.121573,-1.449263e-08,0.016978,-0.121042,-1.442933e-08,0.016978,-0.121042,0.001999986,-0.02,-0.12,0.001999986,-0.019047,-0.120065,0.001999986,-0.02,0.06,0.002000007,0.015764,-0.122191,0.001999985,0.015764,-0.122191,-1.45663e-08,0.016353,-0.121573,-1.449263e-08,0.014929,-0.123252,-1.469278e-08,0.015764,-0.122191,-1.45663e-08,0.015764,-0.122191,0.001999985,-0.018231,0.060289,0.002000007,-0.019075,0.060079,0.002000007,0.019137,0.060079,0.002000007,0.002936,-0.134721,0.001999984,0.007464,-0.132813,0.001999984,0.008788,-0.131752,0.001999984,0.0015,-0.077781,0.001999991,0.019137,0.060079,0.002000007,-0.019075,0.060079,0.002000007,-0.018604,-0.120148,0.001999986,-0.0015,-0.097781,0.001999988,-0.0015,-0.077781,0.001999991,-0.018604,-0.120148,0.001999986,0.019149,-0.120075,0.001999986,0.0015,-0.097781,0.001999988,0.0015,-0.077781,0.001999991,0.0015,-0.097781,0.001999988,0.019149,-0.120075,0.001999986,0,-0.135,0.001999984,0.009953,-0.130562,0.001999984,-0.010391,-0.129722,0.001999985,-0.017458,0.060619,0.002000007,-0.018231,0.060289,0.002000007,0.018344,0.060288,0.002000007,0.001531,-0.134926,0.001999984,0.008788,-0.131752,0.001999984,0.009953,-0.130562,0.001999984,-0.016747,0.061058,0.002000007,-0.017458,0.060619,0.002000007,0.017614,0.060617,0.002000007,0.009953,-0.130562,0.001999984,0.014929,-0.123252,0.001999985,-0.011868,-0.127496,0.001999985,-0.016089,0.061593,0.002000008,-0.016747,0.061058,0.002000007,0.016937,0.061053,0.002000007,0.014929,-0.123252,0.001999985,0.015764,-0.122191,0.001999985,-0.014802,-0.122855,0.001999985,-0.015475,0.062214,0.002000008,-0.016089,0.061593,0.002000008,0.016304,0.061587,0.002000008,0.015764,-0.122191,0.001999985,0.016353,-0.121573,0.001999986,-0.015686,-0.121844,0.001999986,-0.014617,0.063281,0.002000008,-0.015475,0.062214,0.002000008,0.015421,0.062543,0.002000008,-0.007335,0.072848,0.002000009,-0.008209,0.072159,0.002000009,-0.004169,0.074417,0.002000009,-0.005324,0.073988,0.002000009,-0.006376,0.073461,0.002000009,-0.007335,0.072848,0.002000009,0.009953,-0.130562,-1.55642e-08,0.014929,-0.123252,-1.469278e-08,0.014929,-0.123252,0.001999985,0.016978,-0.121042,0.001999986,0.017646,-0.120607,0.001999986,-0.017021,-0.120787,0.001999986,0.016353,-0.121573,0.001999986,0.016978,-0.121042,0.001999986,-0.016327,-0.121269,0.001999986,-0.009384,0.071011,0.002000008,-0.014617,0.063281,0.002000008,0.012136,0.067516,0.002000008,0.009512,0.070979,0.002000008,0,0.075,0.002000009,-0.009384,0.071011,0.002000008,-0.008209,0.072159,0.002000009,-0.009384,0.071011,0.002000008,-0.002903,0.074736,0.002000009,-0.001517,0.074934,0.002000009,-0.002903,0.074736,0.002000009,-0.009384,0.071011,0.002000008,0.001519,0.074926,0.002000009,0,0.075,0.002000009,0.009512,0.070979,0.002000008,0.002913,0.074722,0.002000009,0.001519,0.074926,0.002000009,0.008304,0.072129,0.002000009,0.017646,-0.120607,0.001999986,0.018367,-0.120281,0.001999986,-0.017776,-0.120409,0.001999986,0.007408,0.072818,0.002000009,0.00536,0.073964,0.002000009,0.004191,0.074397,0.002000009,0.007408,0.072818,0.002000009,0.00643,0.073434,0.002000009,0.00536,0.073964,0.002000009,-0.018604,-0.120148,0.001999986,-0.017776,-0.120409,0.001999986,0.018367,-0.120281,0.001999986,0.02,0.06,0.002000007,0.019137,0.060079,0.002000007,0.019149,-0.120075,0.001999986,0.005401,-0.133961,0.001999984,0.006479,-0.13343,0.001999984,0.007464,-0.132813,0.001999984,0.008788,-0.131752,-1.570606e-08,0.009953,-0.130562,-1.55642e-08,0.009953,-0.130562,0.001999984,0.004223,-0.134395,0.001999984,0.005401,-0.133961,0.001999984,0.007464,-0.132813,0.001999984,-0.001527,-0.134934,0.001999984,0,-0.135,0.001999984,-0.009371,-0.130983,0.001999984,-0.00821,-0.132139,0.001999984,-0.004188,-0.134412,0.001999984,-0.002919,-0.134734,0.001999984,0.007464,-0.132813,-1.583254e-08,0.008788,-0.131752,-1.570606e-08,0.008788,-0.131752,0.001999984,-0.007343,-0.132832,0.001999984,-0.005342,-0.13398,0.001999984,-0.004188,-0.134412,0.001999984,0.006479,-0.13343,-1.59061e-08,0.007464,-0.132813,-1.583254e-08,0.007464,-0.132813,0.001999984,-0.007343,-0.132832,0.001999984,-0.00639,-0.13345,0.001999984,-0.005342,-0.13398,0.001999984,0.005401,-0.133961,0.001999984,0.005401,-0.133961,-1.59694e-08,0.006479,-0.13343,-1.59061e-08,0.004223,-0.134395,-1.602113e-08,0.005401,-0.133961,-1.59694e-08,0.005401,-0.133961,0.001999984,0.002936,-0.134721,-1.605999e-08,0.004223,-0.134395,-1.602113e-08,0.004223,-0.134395,0.001999984,0.001531,-0.134926,-1.608443e-08,0.002936,-0.134721,-1.605999e-08,0.002936,-0.134721,0.001999984,0,-0.135,-1.609325e-08,0.001531,-0.134926,-1.608443e-08,0.001531,-0.134926,0.001999984,-0.001527,-0.134934,-1.608539e-08,0,-0.135,-1.609325e-08,0,-0.135,0.001999984,-0.002919,-0.134734,-1.606154e-08,-0.001527,-0.134934,-1.608539e-08,-0.001527,-0.134934,0.001999984,-0.004188,-0.134412,-1.602316e-08,-0.002919,-0.134734,-1.606154e-08,-0.002919,-0.134734,0.001999984,-0.005342,-0.13398,-1.597166e-08,-0.004188,-0.134412,-1.602316e-08,-0.004188,-0.134412,0.001999984,-0.00639,-0.13345,-1.590848e-08,-0.005342,-0.13398,-1.597166e-08,-0.005342,-0.13398,0.001999984,-0.007343,-0.132832,-1.583481e-08,-0.00639,-0.13345,-1.590848e-08,-0.00639,-0.13345,0.001999984,-0.00821,-0.132139,-1.57522e-08,-0.007343,-0.132832,-1.583481e-08,-0.007343,-0.132832,0.001999984,-0.009371,-0.130983,-1.561439e-08,-0.00821,-0.132139,-1.57522e-08,-0.00821,-0.132139,0.001999984,-0.010391,-0.129722,-1.546407e-08,-0.009371,-0.130983,-1.561439e-08,-0.009371,-0.130983,0.001999984,-0.011868,-0.127496,-1.519871e-08,-0.010391,-0.129722,-1.546407e-08,-0.010391,-0.129722,0.001999985,-0.014802,-0.122855,-1.464546e-08,-0.011868,-0.127496,-1.519871e-08,-0.011868,-0.127496,0.001999985,-0.015686,-0.121844,-1.452494e-08,-0.014802,-0.122855,-1.464546e-08,-0.014802,-0.122855,0.001999985,-0.016327,-0.121269,-1.445639e-08,-0.015686,-0.121844,-1.452494e-08,-0.015686,-0.121844,0.001999986,-0.017021,-0.120787,-1.439893e-08,-0.016327,-0.121269,-1.445639e-08,-0.016327,-0.121269,0.001999986,-0.017776,-0.120409,-1.435387e-08,-0.017021,-0.120787,-1.439893e-08,-0.017021,-0.120787,0.001999986,-0.018604,-0.120148,-1.432276e-08,-0.017776,-0.120409,-1.435387e-08,-0.017776,-0.120409,0.001999986,-0.018604,-0.120148,-1.432276e-08,-0.018604,-0.120148,0.001999986,-0.019047,-0.120065,0.001999986,-0.02,-0.12,-1.430511e-08,-0.019047,-0.120065,-1.431286e-08,-0.019047,-0.120065,0.001999986,-0.02,0.06,7.152557e-09,-0.02,-0.12,-1.430511e-08,-0.02,-0.12,0.001999986,-0.019075,0.060079,7.161975e-09,-0.02,0.06,7.152557e-09,-0.02,0.06,0.002000007,-0.018231,0.060289,7.187009e-09,-0.019075,0.060079,7.161975e-09,-0.019075,0.060079,0.002000007,-0.017458,0.060619,7.226348e-09,-0.018231,0.060289,7.187009e-09,-0.018231,0.060289,0.002000007,-0.016747,0.061058,7.278681e-09,-0.017458,0.060619,7.226348e-09,-0.017458,0.060619,0.002000007,-0.016089,0.061593,7.342458e-09,-0.016747,0.061058,7.278681e-09,-0.016747,0.061058,0.002000007,-0.015475,0.062214,7.416487e-09,-0.016089,0.061593,7.342458e-09,-0.016089,0.061593,0.002000008,-0.014617,0.063281,7.543683e-09,-0.015475,0.062214,7.416487e-09,-0.015475,0.062214,0.002000008,-0.009384,0.071011,8.465171e-09,-0.014617,0.063281,7.543683e-09,-0.014617,0.063281,0.002000008,-0.008209,0.072159,8.602023e-09,-0.009384,0.071011,8.465171e-09,-0.009384,0.071011,0.002000008,-0.007335,0.072848,8.684158e-09,-0.008209,0.072159,8.602023e-09,-0.008209,0.072159,0.002000009,-0.006376,0.073461,8.757234e-09,-0.007335,0.072848,8.684158e-09,-0.007335,0.072848,0.002000009,-0.005324,0.073988,8.820057e-09,-0.006376,0.073461,8.757234e-09,-0.006376,0.073461,0.002000009,-0.004169,0.074417,8.871198e-09,-0.005324,0.073988,8.820057e-09,-0.005324,0.073988,0.002000009,-0.002903,0.074736,8.909225e-09,-0.004169,0.074417,8.871198e-09,-0.004169,0.074417,0.002000009,-0.001517,0.074934,8.932829e-09,-0.002903,0.074736,8.909225e-09,-0.002903,0.074736,0.002000009,0,0.075,8.940697e-09,-0.001517,0.074934,8.932829e-09,-0.001517,0.074934,0.002000009,0.001519,0.074926,8.931875e-09,0,0.075,8.940697e-09,0,0.075,0.002000009,0.002913,0.074722,8.907556e-09,0.001519,0.074926,8.931875e-09,0.001519,0.074926,0.002000009,0.004191,0.074397,8.868813e-09,0.002913,0.074722,8.907556e-09,0.002913,0.074722,0.002000009,0.00536,0.073964,8.817196e-09,0.004191,0.074397,8.868813e-09,0.004191,0.074397,0.002000009,0.00643,0.073434,8.754015e-09,0.00536,0.073964,8.817196e-09,0.00536,0.073964,0.002000009,0.007408,0.072818,0.002000009,0.007408,0.072818,8.680582e-09,0.00643,0.073434,8.754015e-09,0.008304,0.072129,8.598447e-09,0.007408,0.072818,8.680582e-09,0.007408,0.072818,0.002000009,0.009512,0.070979,0.002000008,0.009512,0.070979,8.461356e-09,0.008304,0.072129,8.598447e-09,0.010582,0.069727,8.312107e-09,0.009512,0.070979,8.461356e-09,0.009512,0.070979,0.002000008,0.012136,0.067516,8.048534e-09,0.010582,0.069727,8.312107e-09,0.010582,0.069727,0.002000008,0.015421,0.062543,0.002000008,0.015421,0.062543,7.455706e-09,0.012136,0.067516,8.048534e-09,0.016304,0.061587,7.341742e-09,0.015421,0.062543,7.455706e-09,0.015421,0.062543,0.002000008,0.016937,0.061053,0.002000007,0.016937,0.061053,7.278085e-09,0.016304,0.061587,7.341742e-09,0.017614,0.060617,7.226109e-09,0.016937,0.061053,7.278085e-09,0.016937,0.061053,0.002000007,0.018344,0.060288,7.18689e-09,0.017614,0.060617,7.226109e-09,0.017614,0.060617,0.002000007,0.019137,0.060079,7.161975e-09,0.018344,0.060288,7.18689e-09,0.018344,0.060288,0.002000007,0.02,0.06,7.152557e-09,0.019137,0.060079,7.161975e-09,0.019137,0.060079,0.002000007,0.02,-0.12,-1.430511e-08,0.02,0.06,7.152557e-09,0.02,0.06,0.002000007,0.019149,-0.120075,-1.431406e-08,0.02,-0.12,-1.430511e-08,0.02,-0.12,0.001999986,0.018367,-0.120281,0.001999986,0.018367,-0.120281,-1.433861e-08,0.019149,-0.120075,-1.431406e-08,0.017646,-0.120607,-1.437748e-08,0.018367,-0.120281,-1.433861e-08,0.018367,-0.120281,0.001999986,0.016978,-0.121042,-1.442933e-08,0.017646,-0.120607,-1.437748e-08,0.017646,-0.120607,0.001999986,0.0015,-0.097781,0.001999988,0.0015,-0.077781,0.001999991,0.0015,-0.077781,0.0002859907,-0.0015,-0.097781,0.0002859883,0.0015,-0.097781,0.0002859883,0.0015,-0.077781,0.0002859907,-0.0015,-0.077781,0.001999991,-0.0015,-0.097781,0.001999988,-0.0015,-0.097781,0.0002859883,0.0015,-0.077781,0.001999991,-0.0015,-0.077781,0.001999991,-0.0015,-0.077781,0.0002859907,-0.0015,-0.097781,0.001999988,0.0015,-0.097781,0.001999988,0.0015,-0.097781,0.0002859883,-0.117827,0.01488799,0.05,-0.13022,0.01067999,0.05,-0.12806,0.006308994,0.05,-0.099274,0.01439299,0.05,-0.099431,0.01943799,0.05,-0.117827,0.01488799,0.05,-0.014557,0.006875994,0.05,-0.013731,0.006550996,0.03,-0.025779,0.01158599,0.05,-0.117827,0.014888,0.03,-0.13022,0.01068,0.03,-0.13022,0.01067999,0.05,-0.084271,0.016682,0.05,-0.083361,0.02189199,0.05,-0.099431,0.01943799,0.05,-0.004666,0.011094,0.03,-0.010367,0.007194996,0.03,-0.006544,0.01007999,0.05,-0.07202,0.022593,0.05,-0.083361,0.02189199,0.05,-0.084271,0.016682,0.05,-0.001836,-0.011942,0.03,0.003453,-0.011674,0.03,0.002058,-0.01196301,0.05,-0.041427,0.017156,0.03,-0.036433,0.009406996,0.03,-0.046802,0.013694,0.03,-0.028133,0.004891996,0.03,-0.019128,-0.001211004,0.03,-0.025827,0.003515994,0.05,-0.025779,0.011586,0.03,-0.028133,0.004891996,0.03,-0.036433,0.009406996,0.03,-0.116398,0.01016199,0.05,-0.099274,0.01439299,0.05,-0.117827,0.01488799,0.05,-0.002725,-0.01174801,0.05,-0.006544,0.01007999,0.05,-0.008287,-0.009412006,0.05,-0.061504,0.017023,0.05,-0.063789,0.02212399,0.05,-0.07202,0.022593,0.05,-0.05451,0.020603,0.03,-0.066857,0.022477,0.03,-0.063789,0.02212399,0.05,-0.061504,0.017023,0.05,-0.05451,0.02060299,0.05,-0.063789,0.02212399,0.05,-0.099274,0.01439299,0.05,-0.099274,0.014393,0.03,-0.084271,0.016682,0.05,-0.041427,0.01715599,0.05,-0.05451,0.02060299,0.05,-0.048108,0.01411699,0.05,0.00138,0.012095,0.03,-0.004666,0.011094,0.03,-0.001142,0.01205599,0.05,-0.061504,0.017023,0.05,-0.048108,0.01411699,0.05,-0.05451,0.02060299,0.05,-0.084271,0.016682,0.03,-0.071009,0.017476,0.03,-0.071009,0.01747599,0.05,-0.025779,0.011586,0.03,-0.013731,0.006550996,0.03,-0.028133,0.004891996,0.03,-0.025779,0.01158599,0.05,-0.041427,0.01715599,0.05,-0.036433,0.009406994,0.05,0.008867,0.008342994,0.05,0.008705,0.008682996,0.03,0.004144,0.01134299,0.05,-0.048108,0.01411699,0.05,-0.036433,0.009406994,0.05,-0.041427,0.01715599,0.05,0.002058,-0.01196301,0.05,0.011654,-0.003769006,0.05,-0.002725,-0.01174801,0.05,-0.014557,0.006875994,0.05,-0.025779,0.01158599,0.05,-0.025827,0.003515994,0.05,-0.061504,0.017023,0.05,-0.060622,0.016912,0.03,-0.048108,0.01411699,0.05,-0.041427,0.017156,0.03,-0.025779,0.011586,0.03,-0.036433,0.009406996,0.03,-0.05451,0.020603,0.03,-0.060622,0.016912,0.03,-0.066857,0.022477,0.03,-0.010367,0.007194996,0.03,-0.013731,0.006550996,0.03,-0.011039,0.006736994,0.05,-0.025827,0.003515994,0.05,-0.011039,0.006736994,0.05,-0.014557,0.006875994,0.05,-0.099431,0.01943799,0.05,-0.099431,0.019438,0.03,-0.117827,0.01488799,0.05,-0.084271,0.016682,0.05,-0.084271,0.016682,0.03,-0.071009,0.01747599,0.05,-0.041427,0.01715599,0.05,-0.041427,0.017156,0.03,-0.05451,0.02060299,0.05,-0.05451,0.02060299,0.05,-0.05451,0.020603,0.03,-0.063789,0.02212399,0.05,0.011705,0.003085994,0.05,0.004144,0.01134299,0.05,0.011654,-0.003769006,0.05,-0.036433,0.009406994,0.05,-0.036433,0.009406996,0.03,-0.025827,0.003515994,0.05,-0.008287,-0.009412006,0.05,-0.006544,0.01007999,0.05,-0.011039,0.006736994,0.05,0.008705,0.008682996,0.03,0.00138,0.012095,0.03,0.004144,0.01134299,0.05,-0.011039,0.006736994,0.05,-0.013731,0.006550996,0.03,-0.014557,0.006875994,0.05,-0.013731,0.006550996,0.03,-0.019128,-0.001211004,0.03,-0.028133,0.004891996,0.03,0.004144,0.01134299,0.05,0.00138,0.012095,0.03,-0.001142,0.01205599,0.05,-0.099274,0.01439299,0.05,-0.084271,0.016682,0.05,-0.099431,0.01943799,0.05,-0.025827,0.003515994,0.05,-0.025779,0.01158599,0.05,-0.036433,0.009406994,0.05,-0.081659,0.022124,0.03,-0.099431,0.019438,0.03,-0.099431,0.01943799,0.05,-0.002725,-0.01174801,0.05,0.011654,-0.003769006,0.05,-0.006544,0.01007999,0.05,-0.099274,0.014393,0.03,-0.084271,0.016682,0.03,-0.084271,0.016682,0.05,-0.13022,0.01068,0.03,-0.12806,0.006308996,0.03,-0.12806,0.006308994,0.05,-0.013731,0.006550996,0.03,-0.025779,0.011586,0.03,-0.025779,0.01158599,0.05,-0.081659,0.022124,0.03,-0.084271,0.016682,0.03,-0.099431,0.019438,0.03,-0.025827,0.003515994,0.05,-0.008287,-0.009412006,0.05,-0.011039,0.006736994,0.05,-0.019128,-0.001211004,0.03,-0.007621,-0.009812004,0.03,-0.008287,-0.009412006,0.05,-0.025827,0.003515994,0.05,-0.019128,-0.001211004,0.03,-0.008287,-0.009412006,0.05,-0.071009,0.01747599,0.05,-0.07202,0.022593,0.05,-0.084271,0.016682,0.05,-0.063789,0.02212399,0.05,-0.066857,0.022477,0.03,-0.07202,0.022593,0.05,-0.07202,0.022593,0.05,-0.081659,0.022124,0.03,-0.083361,0.02189199,0.05,0.004144,0.01134299,0.05,-0.001142,0.01205599,0.05,0.011654,-0.003769006,0.05,-0.116398,0.010162,0.03,-0.099274,0.014393,0.03,-0.099274,0.01439299,0.05,-0.116398,0.01016199,0.05,-0.117827,0.01488799,0.05,-0.12806,0.006308994,0.05,-0.002725,-0.01174801,0.05,-0.001836,-0.011942,0.03,0.002058,-0.01196301,0.05,0.008867,0.008342994,0.05,0.004144,0.01134299,0.05,0.011705,0.003085994,0.05,-0.071009,0.01747599,0.05,-0.061504,0.017023,0.05,-0.07202,0.022593,0.05,-0.048108,0.01411699,0.05,-0.046802,0.013694,0.03,-0.036433,0.009406994,0.05,-0.025779,0.01158599,0.05,-0.025779,0.011586,0.03,-0.041427,0.01715599,0.05,-0.099431,0.019438,0.03,-0.117827,0.014888,0.03,-0.117827,0.01488799,0.05,-0.066857,0.022477,0.03,-0.081659,0.022124,0.03,-0.07202,0.022593,0.05,-0.099431,0.019438,0.03,-0.099274,0.014393,0.03,-0.117827,0.014888,0.03,-0.117827,0.01488799,0.05,-0.117827,0.014888,0.03,-0.13022,0.01067999,0.05,-0.116398,0.01016199,0.05,-0.116398,0.010162,0.03,-0.099274,0.01439299,0.05,-0.041427,0.017156,0.03,-0.05451,0.020603,0.03,-0.05451,0.02060299,0.05,-0.006544,0.01007999,0.05,-0.010367,0.007194996,0.03,-0.011039,0.006736994,0.05,-0.025779,0.011586,0.03,-0.041427,0.017156,0.03,-0.041427,0.01715599,0.05,-0.12806,0.006308996,0.03,-0.116398,0.010162,0.03,-0.116398,0.01016199,0.05,-0.13022,0.01067999,0.05,-0.13022,0.01068,0.03,-0.12806,0.006308994,0.05,-0.007621,-0.009812004,0.03,-0.019128,-0.001211004,0.03,-0.013731,0.006550996,0.03,-0.05451,0.020603,0.03,-0.046802,0.013694,0.03,-0.060622,0.016912,0.03,0.002058,-0.01196301,0.05,0.003453,-0.011674,0.03,0.007522,-0.009724005,0.05,-0.046802,0.013694,0.03,-0.036433,0.009406996,0.03,-0.036433,0.009406994,0.05,0.012011,0.001776996,0.03,0.008705,0.008682996,0.03,0.011705,0.003085994,0.05,-0.060622,0.016912,0.03,-0.046802,0.013694,0.03,-0.048108,0.01411699,0.05,-0.071009,0.017476,0.03,-0.060622,0.016912,0.03,-0.061504,0.017023,0.05,-0.001142,0.01205599,0.05,-0.006544,0.01007999,0.05,0.011654,-0.003769006,0.05,0.011654,-0.003769006,0.05,0.012011,0.001776996,0.03,0.011705,0.003085994,0.05,-0.008287,-0.009412006,0.05,-0.007621,-0.009812004,0.03,-0.002725,-0.01174801,0.05,-0.071009,0.01747599,0.05,-0.071009,0.017476,0.03,-0.061504,0.017023,0.05,-0.001142,0.01205599,0.05,-0.004666,0.011094,0.03,-0.006544,0.01007999,0.05,-0.05451,0.020603,0.03,-0.041427,0.017156,0.03,-0.046802,0.013694,0.03,0.011131,-0.005043004,0.03,0.012011,0.001776996,0.03,0.011654,-0.003769006,0.05,0.007522,-0.009724005,0.05,0.011654,-0.003769006,0.05,0.002058,-0.01196301,0.05,0.003453,-0.011674,0.03,0.007132,-0.009824004,0.03,0.007522,-0.009724005,0.05,-0.116398,0.010162,0.03,-0.12806,0.006308996,0.03,-0.117827,0.014888,0.03,-0.099274,0.014393,0.03,-0.116398,0.010162,0.03,-0.117827,0.014888,0.03,-0.12806,0.006308996,0.03,-0.13022,0.01068,0.03,-0.117827,0.014888,0.03,-0.084271,0.016682,0.03,-0.099274,0.014393,0.03,-0.099431,0.019438,0.03,-0.081659,0.022124,0.03,-0.071009,0.017476,0.03,-0.084271,0.016682,0.03,-0.083361,0.02189199,0.05,-0.081659,0.022124,0.03,-0.099431,0.01943799,0.05,-0.060622,0.016912,0.03,-0.071009,0.017476,0.03,-0.066857,0.022477,0.03,0.011705,0.003085994,0.05,0.008705,0.008682996,0.03,0.008867,0.008342994,0.05,0.007132,-0.009824004,0.03,0.011131,-0.005043004,0.03,0.007522,-0.009724005,0.05,-0.081659,0.022124,0.03,-0.066857,0.022477,0.03,-0.071009,0.017476,0.03,-0.036433,0.009406996,0.03,-0.028133,0.004891996,0.03,-0.025827,0.003515994,0.05,-0.12806,0.006308994,0.05,-0.12806,0.006308996,0.03,-0.116398,0.01016199,0.05,-0.007621,-0.009812004,0.03,-0.001836,-0.011942,0.03,-0.002725,-0.01174801,0.05,0.007522,-0.009724005,0.05,0.011131,-0.005043004,0.03,0.011654,-0.003769006,0.05,0.008705,0.008682996,0.03,0.006472,0.004701996,0.03,0.002472,0.007607996,0.03,0.00138,0.012095,0.03,0.002472,0.007607996,0.03,-0.002472,0.007607996,0.03,0.012011,0.001776996,0.03,0.008,-3.576279e-09,0.03,0.006472,0.004701996,0.03,0.011131,-0.005043004,0.03,0.006472,-0.004702004,0.03,0.008,-3.576279e-09,0.03,0.007132,-0.009824004,0.03,0.002472,-0.007608004,0.03,0.006472,-0.004702004,0.03,-0.002472,-0.007608004,0.03,-0.001836,-0.011942,0.03,-0.007621,-0.009812004,0.03,-0.007621,-0.009812004,0.03,-0.013731,0.006550996,0.03,-0.008,-3.576279e-09,0.03,-0.010367,0.007194996,0.03,-0.006472,0.004701996,0.03,-0.008,-3.576279e-09,0.03,-0.004666,0.011094,0.03,-0.002472,0.007607996,0.03,-0.006472,0.004701996,0.03,-0.006472,0.004701996,0.03,-0.002472,0.007607996,0.03,-0.002472,0.007608,0.002000001,0.006472,0.004701996,0.03,0.008,-3.576279e-09,0.03,0.008,-2.384186e-10,0.002,0.006472,-0.004702004,0.03,0.002472,-0.007608004,0.03,0.002472,-0.007608001,0.001999999,-0.008,-2.384186e-10,0.002,-0.008,-3.576279e-09,0.03,-0.006472,0.004701996,0.03,0.002472,0.007607996,0.03,0.006472,0.004701996,0.03,0.006472,0.004701999,0.002000001,0.002472,-0.007608004,0.03,-0.002472,-0.007608004,0.03,-0.002472,-0.007608001,0.001999999,-0.006472,-0.004702,0.002,-0.006472,-0.004702004,0.03,-0.008,-3.576279e-09,0.03,-0.002472,0.007607996,0.03,0.002472,0.007607996,0.03,0.002472,0.007608,0.002000001,0.008,-3.576279e-09,0.03,0.006472,-0.004702004,0.03,0.006472,-0.004702,0.002,-0.002472,-0.007608004,0.03,-0.006472,-0.004702004,0.03,-0.006472,-0.004702,0.002,0.002472,-0.007608004,0.03,0.003453,-0.011674,0.03,-0.001836,-0.011942,0.03,-0.018604,-0.120148,0.001999986,-0.019075,0.060079,0.002000007,-0.019047,-0.120065,0.001999986,0.016353,-0.121573,0.001999986,0.016353,-0.121573,-1.449263e-08,0.016978,-0.121042,0.001999986,0.016353,-0.121573,0.001999986,0.015764,-0.122191,0.001999985,0.016353,-0.121573,-1.449263e-08,0.014929,-0.123252,0.001999985,0.014929,-0.123252,-1.469278e-08,0.015764,-0.122191,0.001999985,0.018344,0.060288,0.002000007,-0.018231,0.060289,0.002000007,0.019137,0.060079,0.002000007,0.001531,-0.134926,0.001999984,0.002936,-0.134721,0.001999984,0.008788,-0.131752,0.001999984,-0.0015,-0.077781,0.001999991,0.0015,-0.077781,0.001999991,-0.019075,0.060079,0.002000007,-0.019075,0.060079,0.002000007,-0.018604,-0.120148,0.001999986,-0.0015,-0.077781,0.001999991,-0.0015,-0.097781,0.001999988,-0.018604,-0.120148,0.001999986,0.0015,-0.097781,0.001999988,0.019137,0.060079,0.002000007,0.0015,-0.077781,0.001999991,0.019149,-0.120075,0.001999986,-0.009371,-0.130983,0.001999984,0,-0.135,0.001999984,-0.010391,-0.129722,0.001999985,0.017614,0.060617,0.002000007,-0.017458,0.060619,0.002000007,0.018344,0.060288,0.002000007,0,-0.135,0.001999984,0.001531,-0.134926,0.001999984,0.009953,-0.130562,0.001999984,0.016937,0.061053,0.002000007,-0.016747,0.061058,0.002000007,0.017614,0.060617,0.002000007,-0.010391,-0.129722,0.001999985,0.009953,-0.130562,0.001999984,-0.011868,-0.127496,0.001999985,0.016304,0.061587,0.002000008,-0.016089,0.061593,0.002000008,0.016937,0.061053,0.002000007,-0.011868,-0.127496,0.001999985,0.014929,-0.123252,0.001999985,-0.014802,-0.122855,0.001999985,0.015421,0.062543,0.002000008,-0.015475,0.062214,0.002000008,0.016304,0.061587,0.002000008,-0.014802,-0.122855,0.001999985,0.015764,-0.122191,0.001999985,-0.015686,-0.121844,0.001999986,0.012136,0.067516,0.002000008,-0.014617,0.063281,0.002000008,0.015421,0.062543,0.002000008,-0.005324,0.073988,0.002000009,-0.007335,0.072848,0.002000009,-0.004169,0.074417,0.002000009,0.009953,-0.130562,0.001999984,0.009953,-0.130562,-1.55642e-08,0.014929,-0.123252,0.001999985,-0.016327,-0.121269,0.001999986,0.016978,-0.121042,0.001999986,-0.017021,-0.120787,0.001999986,-0.015686,-0.121844,0.001999986,0.016353,-0.121573,0.001999986,-0.016327,-0.121269,0.001999986,0.010582,0.069727,0.002000008,-0.009384,0.071011,0.002000008,0.012136,0.067516,0.002000008,0.010582,0.069727,0.002000008,0.009512,0.070979,0.002000008,-0.009384,0.071011,0.002000008,-0.004169,0.074417,0.002000009,-0.008209,0.072159,0.002000009,-0.002903,0.074736,0.002000009,0,0.075,0.002000009,-0.001517,0.074934,0.002000009,-0.009384,0.071011,0.002000008,0.008304,0.072129,0.002000009,0.001519,0.074926,0.002000009,0.009512,0.070979,0.002000008,0.004191,0.074397,0.002000009,0.002913,0.074722,0.002000009,0.008304,0.072129,0.002000009,-0.017021,-0.120787,0.001999986,0.017646,-0.120607,0.001999986,-0.017776,-0.120409,0.001999986,0.008304,0.072129,0.002000009,0.007408,0.072818,0.002000009,0.004191,0.074397,0.002000009,0.019149,-0.120075,0.001999986,-0.018604,-0.120148,0.001999986,0.018367,-0.120281,0.001999986,0.02,-0.12,0.001999986,0.02,0.06,0.002000007,0.019149,-0.120075,0.001999986,0.008788,-0.131752,0.001999984,0.008788,-0.131752,-1.570606e-08,0.009953,-0.130562,0.001999984,0.002936,-0.134721,0.001999984,0.004223,-0.134395,0.001999984,0.007464,-0.132813,0.001999984,-0.002919,-0.134734,0.001999984,-0.001527,-0.134934,0.001999984,-0.009371,-0.130983,0.001999984,-0.009371,-0.130983,0.001999984,-0.00821,-0.132139,0.001999984,-0.002919,-0.134734,0.001999984,0.007464,-0.132813,0.001999984,0.007464,-0.132813,-1.583254e-08,0.008788,-0.131752,0.001999984,-0.00821,-0.132139,0.001999984,-0.007343,-0.132832,0.001999984,-0.004188,-0.134412,0.001999984,0.006479,-0.13343,0.001999984,0.006479,-0.13343,-1.59061e-08,0.007464,-0.132813,0.001999984,0.006479,-0.13343,0.001999984,0.005401,-0.133961,0.001999984,0.006479,-0.13343,-1.59061e-08,0.004223,-0.134395,0.001999984,0.004223,-0.134395,-1.602113e-08,0.005401,-0.133961,0.001999984,0.002936,-0.134721,0.001999984,0.002936,-0.134721,-1.605999e-08,0.004223,-0.134395,0.001999984,0.001531,-0.134926,0.001999984,0.001531,-0.134926,-1.608443e-08,0.002936,-0.134721,0.001999984,0,-0.135,0.001999984,0,-0.135,-1.609325e-08,0.001531,-0.134926,0.001999984,-0.001527,-0.134934,0.001999984,-0.001527,-0.134934,-1.608539e-08,0,-0.135,0.001999984,-0.002919,-0.134734,0.001999984,-0.002919,-0.134734,-1.606154e-08,-0.001527,-0.134934,0.001999984,-0.004188,-0.134412,0.001999984,-0.004188,-0.134412,-1.602316e-08,-0.002919,-0.134734,0.001999984,-0.005342,-0.13398,0.001999984,-0.005342,-0.13398,-1.597166e-08,-0.004188,-0.134412,0.001999984,-0.00639,-0.13345,0.001999984,-0.00639,-0.13345,-1.590848e-08,-0.005342,-0.13398,0.001999984,-0.007343,-0.132832,0.001999984,-0.007343,-0.132832,-1.583481e-08,-0.00639,-0.13345,0.001999984,-0.00821,-0.132139,0.001999984,-0.00821,-0.132139,-1.57522e-08,-0.007343,-0.132832,0.001999984,-0.009371,-0.130983,0.001999984,-0.009371,-0.130983,-1.561439e-08,-0.00821,-0.132139,0.001999984,-0.010391,-0.129722,0.001999985,-0.010391,-0.129722,-1.546407e-08,-0.009371,-0.130983,0.001999984,-0.011868,-0.127496,0.001999985,-0.011868,-0.127496,-1.519871e-08,-0.010391,-0.129722,0.001999985,-0.014802,-0.122855,0.001999985,-0.014802,-0.122855,-1.464546e-08,-0.011868,-0.127496,0.001999985,-0.015686,-0.121844,0.001999986,-0.015686,-0.121844,-1.452494e-08,-0.014802,-0.122855,0.001999985,-0.016327,-0.121269,0.001999986,-0.016327,-0.121269,-1.445639e-08,-0.015686,-0.121844,0.001999986,-0.017021,-0.120787,0.001999986,-0.017021,-0.120787,-1.439893e-08,-0.016327,-0.121269,0.001999986,-0.017776,-0.120409,0.001999986,-0.017776,-0.120409,-1.435387e-08,-0.017021,-0.120787,0.001999986,-0.018604,-0.120148,0.001999986,-0.018604,-0.120148,-1.432276e-08,-0.017776,-0.120409,0.001999986,-0.019047,-0.120065,-1.431286e-08,-0.018604,-0.120148,-1.432276e-08,-0.019047,-0.120065,0.001999986,-0.02,-0.12,0.001999986,-0.02,-0.12,-1.430511e-08,-0.019047,-0.120065,0.001999986,-0.02,0.06,0.002000007,-0.02,0.06,7.152557e-09,-0.02,-0.12,0.001999986,-0.019075,0.060079,0.002000007,-0.019075,0.060079,7.161975e-09,-0.02,0.06,0.002000007,-0.018231,0.060289,0.002000007,-0.018231,0.060289,7.187009e-09,-0.019075,0.060079,0.002000007,-0.017458,0.060619,0.002000007,-0.017458,0.060619,7.226348e-09,-0.018231,0.060289,0.002000007,-0.016747,0.061058,0.002000007,-0.016747,0.061058,7.278681e-09,-0.017458,0.060619,0.002000007,-0.016089,0.061593,0.002000008,-0.016089,0.061593,7.342458e-09,-0.016747,0.061058,0.002000007,-0.015475,0.062214,0.002000008,-0.015475,0.062214,7.416487e-09,-0.016089,0.061593,0.002000008,-0.014617,0.063281,0.002000008,-0.014617,0.063281,7.543683e-09,-0.015475,0.062214,0.002000008,-0.009384,0.071011,0.002000008,-0.009384,0.071011,8.465171e-09,-0.014617,0.063281,0.002000008,-0.008209,0.072159,0.002000009,-0.008209,0.072159,8.602023e-09,-0.009384,0.071011,0.002000008,-0.007335,0.072848,0.002000009,-0.007335,0.072848,8.684158e-09,-0.008209,0.072159,0.002000009,-0.006376,0.073461,0.002000009,-0.006376,0.073461,8.757234e-09,-0.007335,0.072848,0.002000009,-0.005324,0.073988,0.002000009,-0.005324,0.073988,8.820057e-09,-0.006376,0.073461,0.002000009,-0.004169,0.074417,0.002000009,-0.004169,0.074417,8.871198e-09,-0.005324,0.073988,0.002000009,-0.002903,0.074736,0.002000009,-0.002903,0.074736,8.909225e-09,-0.004169,0.074417,0.002000009,-0.001517,0.074934,0.002000009,-0.001517,0.074934,8.932829e-09,-0.002903,0.074736,0.002000009,0,0.075,0.002000009,0,0.075,8.940697e-09,-0.001517,0.074934,0.002000009,0.001519,0.074926,0.002000009,0.001519,0.074926,8.931875e-09,0,0.075,0.002000009,0.002913,0.074722,0.002000009,0.002913,0.074722,8.907556e-09,0.001519,0.074926,0.002000009,0.004191,0.074397,0.002000009,0.004191,0.074397,8.868813e-09,0.002913,0.074722,0.002000009,0.00536,0.073964,0.002000009,0.00536,0.073964,8.817196e-09,0.004191,0.074397,0.002000009,0.00643,0.073434,0.002000009,0.00643,0.073434,8.754015e-09,0.00536,0.073964,0.002000009,0.00643,0.073434,0.002000009,0.007408,0.072818,0.002000009,0.00643,0.073434,8.754015e-09,0.008304,0.072129,0.002000009,0.008304,0.072129,8.598447e-09,0.007408,0.072818,0.002000009,0.008304,0.072129,0.002000009,0.009512,0.070979,0.002000008,0.008304,0.072129,8.598447e-09,0.010582,0.069727,0.002000008,0.010582,0.069727,8.312107e-09,0.009512,0.070979,0.002000008,0.012136,0.067516,0.002000008,0.012136,0.067516,8.048534e-09,0.010582,0.069727,0.002000008,0.012136,0.067516,0.002000008,0.015421,0.062543,0.002000008,0.012136,0.067516,8.048534e-09,0.016304,0.061587,0.002000008,0.016304,0.061587,7.341742e-09,0.015421,0.062543,0.002000008,0.016304,0.061587,0.002000008,0.016937,0.061053,0.002000007,0.016304,0.061587,7.341742e-09,0.017614,0.060617,0.002000007,0.017614,0.060617,7.226109e-09,0.016937,0.061053,0.002000007,0.018344,0.060288,0.002000007,0.018344,0.060288,7.18689e-09,0.017614,0.060617,0.002000007,0.019137,0.060079,0.002000007,0.019137,0.060079,7.161975e-09,0.018344,0.060288,0.002000007,0.02,0.06,0.002000007,0.02,0.06,7.152557e-09,0.019137,0.060079,0.002000007,0.02,-0.12,0.001999986,0.02,-0.12,-1.430511e-08,0.02,0.06,0.002000007,0.019149,-0.120075,0.001999986,0.019149,-0.120075,-1.431406e-08,0.02,-0.12,0.001999986,0.019149,-0.120075,0.001999986,0.018367,-0.120281,0.001999986,0.019149,-0.120075,-1.431406e-08,0.017646,-0.120607,0.001999986,0.017646,-0.120607,-1.437748e-08,0.018367,-0.120281,0.001999986,0.016978,-0.121042,0.001999986,0.016978,-0.121042,-1.442933e-08,0.017646,-0.120607,0.001999986,0.0015,-0.097781,0.0002859883,0.0015,-0.097781,0.001999988,0.0015,-0.077781,0.0002859907,-0.0015,-0.077781,0.0002859907,-0.0015,-0.097781,0.0002859883,0.0015,-0.077781,0.0002859907,-0.0015,-0.077781,0.0002859907,-0.0015,-0.077781,0.001999991,-0.0015,-0.097781,0.0002859883,0.0015,-0.077781,0.0002859907,0.0015,-0.077781,0.001999991,-0.0015,-0.077781,0.0002859907,-0.0015,-0.097781,0.0002859883,-0.0015,-0.097781,0.001999988,0.0015,-0.097781,0.0002859883,0.00138,0.012095,0.03,0.008705,0.008682996,0.03,0.002472,0.007607996,0.03,-0.004666,0.011094,0.03,0.00138,0.012095,0.03,-0.002472,0.007607996,0.03,0.008705,0.008682996,0.03,0.012011,0.001776996,0.03,0.006472,0.004701996,0.03,0.012011,0.001776996,0.03,0.011131,-0.005043004,0.03,0.008,-3.576279e-09,0.03,0.011131,-0.005043004,0.03,0.007132,-0.009824004,0.03,0.006472,-0.004702004,0.03,-0.006472,-0.004702004,0.03,-0.002472,-0.007608004,0.03,-0.007621,-0.009812004,0.03,-0.006472,-0.004702004,0.03,-0.007621,-0.009812004,0.03,-0.008,-3.576279e-09,0.03,-0.013731,0.006550996,0.03,-0.010367,0.007194996,0.03,-0.008,-3.576279e-09,0.03,-0.010367,0.007194996,0.03,-0.004666,0.011094,0.03,-0.006472,0.004701996,0.03,-0.006472,0.004701999,0.002000001,-0.006472,0.004701996,0.03,-0.002472,0.007608,0.002000001,0.006472,0.004701999,0.002000001,0.006472,0.004701996,0.03,0.008,-2.384186e-10,0.002,0.006472,-0.004702,0.002,0.006472,-0.004702004,0.03,0.002472,-0.007608001,0.001999999,-0.006472,0.004701999,0.002000001,-0.008,-2.384186e-10,0.002,-0.006472,0.004701996,0.03,0.002472,0.007608,0.002000001,0.002472,0.007607996,0.03,0.006472,0.004701999,0.002000001,0.002472,-0.007608001,0.001999999,0.002472,-0.007608004,0.03,-0.002472,-0.007608001,0.001999999,-0.008,-2.384186e-10,0.002,-0.006472,-0.004702,0.002,-0.008,-3.576279e-09,0.03,-0.002472,0.007608,0.002000001,-0.002472,0.007607996,0.03,0.002472,0.007608,0.002000001,0.008,-2.384186e-10,0.002,0.008,-3.576279e-09,0.03,0.006472,-0.004702,0.002,-0.002472,-0.007608001,0.001999999,-0.002472,-0.007608004,0.03,-0.006472,-0.004702,0.002,0.003453,-0.011674,0.03,0.002472,-0.007608004,0.03,0.007132,-0.009824004,0.03,0.002472,-0.007608004,0.03,-0.001836,-0.011942,0.03,-0.002472,-0.007608004,0.03])
          for (l = hvs; l < handleVertices.length - 2; l = l + 3) {
            handleVertices[l] += cX
            handleVertices[l + 1] += aY
            handleVertices[l + 2] += iZ
          }
        }
        else {
          // Face Definitions FRONT HANDLE
          // A
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = aX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = aZ
          // B
          handleVertices[ hvPos + 3 ] = aX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = aZ
          // D
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = cX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = cZ
          // C
          handleVertices[ hvPos + 15 ] = cX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = cZ

          hvPos += 18
          // E
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = aX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = eZ
          // F
          handleVertices[ hvPos + 3 ] = aX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = eZ
          // B
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = aX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = aZ
          // A
          handleVertices[ hvPos + 15 ] = aX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = aZ

          hvPos += 18
          // G
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = gX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = eZ
          // H
          handleVertices[ hvPos + 3 ] = gX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = eZ
          // F
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = aX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = eZ
          // E
          handleVertices[ hvPos + 15 ] = aX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = eZ

          hvPos += 18
          // I
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = gX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = iZ
          // J
          handleVertices[ hvPos + 3 ] = gX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = iZ
          // H
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = gX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = eZ
          // G
          handleVertices[ hvPos + 15 ] = gX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = eZ

          hvPos += 18
          // C
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = cX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = cZ
          // D
          handleVertices[ hvPos + 3 ] = cX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = cZ
          // L
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = cX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = iZ
          // K
          handleVertices[ hvPos + 15 ] = cX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = iZ

          hvPos += 18
          // E
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = aX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = eZ
          // A
          handleVertices[ hvPos + 3 ] = aX
          handleVertices[ hvPos + 4 ] = aY
          handleVertices[ hvPos + 5 ] = aZ
          // C
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = cX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = aY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = cZ
          // G
          handleVertices[ hvPos + 15 ] = gX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = eZ

          hvPos += 18
          // K
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = cX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = iZ
          // I
          handleVertices[ hvPos + 3 ] = gX
          handleVertices[ hvPos + 4 ] = aY
          handleVertices[ hvPos + 5 ] = iZ
          // G
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = gX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = aY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = eZ
          // C
          handleVertices[ hvPos + 15 ] = cX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = cZ

          hvPos += 18
          // B
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = aX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = bY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = aZ
          // F
          handleVertices[ hvPos + 3 ] = aX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = eZ
          // H
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = gX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = eZ
          // D
          handleVertices[ hvPos + 15 ] = cX
          handleVertices[ hvPos + 16 ] = bY
          handleVertices[ hvPos + 17 ] = cZ

          hvPos += 18
          // D
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = cX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = bY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = cZ
          // H
          handleVertices[ hvPos + 3 ] = gX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = eZ
          // J
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = gX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = iZ
          // L
          handleVertices[ hvPos + 15 ] = cX
          handleVertices[ hvPos + 16 ] = bY
          handleVertices[ hvPos + 17 ] = iZ

          hvPos += 18

          // HANDLE PLATE

          // Vertex Front View
          // A/E____D/H
          // |      |
          // |      |
          // |      |
          // B/F____C/G

          aX = xCursor + frameLength + leafLength-handlePlateDistance-handlePlateLength
          aY = handleHeight+0.06
          aZ = zCursor+a.leafWidth+handlePlateWidth
          bY = handleHeight+0.06-handlePlateHeight
          cX = xCursor + frameLength + leafLength-handlePlateDistance
          eZ = zCursor-handlePlateWidth

          // A
          handleVertices[ hvPos ] = handleVertices[ hvPos + 9 ] = aX
          handleVertices[ hvPos + 1 ] = handleVertices[ hvPos + 10 ] = aY
          handleVertices[ hvPos + 2 ] = handleVertices[ hvPos + 11 ] = aZ
          // B
          handleVertices[ hvPos + 3 ] = aX
          handleVertices[ hvPos + 4 ] = bY
          handleVertices[ hvPos + 5 ] = aZ
          // C
          handleVertices[ hvPos + 6 ] = handleVertices[ hvPos + 12 ] = cX
          handleVertices[ hvPos + 7 ] = handleVertices[ hvPos + 13 ] = bY
          handleVertices[ hvPos + 8 ] = handleVertices[ hvPos + 14 ] = aZ
          // D
          handleVertices[ hvPos + 15 ] = cX
          handleVertices[ hvPos + 16 ] = aY
          handleVertices[ hvPos + 17 ] = aZ

          hvPos += 18
        }
        // set position in handle vertex array for current door leaf before mirroring
        hve = handleVertices.length
        // Duplicating Handle Vertices
        hvt = handleVertices.slice(hvs, hve)
        var t
        // Mirroring Z Vertices
        for (t = 0; t < hvt.length - 2; t = t + 3) {
          hvt[t + 2] = -hvt[t + 2] + (wallBackPos + a.leafWidth - leafOffset - frameOffset) * 2 - a.leafWidth
        }
        // Changing Vertex Order > Flipping Polygons
        for (t = 0; t < hvt.length - 8; t = t + 9) {
          hvm[1] = hvt[t + 3]
          hvm[2] = hvt[t + 4]
          hvm[3] = hvt[t + 5]
          hvt[t + 3] = hvt[t + 6]
          hvt[t + 4] = hvt[t + 7]
          hvt[t + 5] = hvt[t + 8]
          hvt[t + 6] = hvm[1]
          hvt[t + 7] = hvm[2]
          hvt[t + 8] = hvm[3]
        }
        // Push Vertices into Array
        handleVertices = handleVertices.concat(hvt)
        hvPos += hvt.length

        // set end position in handle vertex array for current door leaf
        hvf = handleVertices.length

        // Flip Handle for flipped door leafs or if hinge is left
        if (leaf[c].flipLeaf || (a.hinge === 'left' && (doorType !== 'doubleSwing' && doorType !== 'doubleSwingDoubleFix'))) {
          for (i = hvs; i < hvf - 2; i = i + 3) {
            xRotate = handleVertices[i] - frameLength - leafLength / 2 - prevLeafs
            handleVertices[i + 2] = handleVertices[i + 2] - wallBackPos - a.leafWidth / 2 + leafOffset + frameOffset
            handleVertices[i] = -xRotate + frameLength + leafLength / 2 + prevLeafs
            handleVertices[i + 2] = -handleVertices[i + 2] + wallBackPos + a.leafWidth / 2 - leafOffset - frameOffset
          }
        }
      }

      // rotation of leaf and handle vertices for door opening
      if (leaf[c].angle > 0) {

        // rotation setup
        xRotate = 0
        cosAngle = Math.cos(leaf[c].angle / 180 * Math.PI)
        sinAngle = Math.sin(leaf[c].angle / 180 * Math.PI)

        if (leaf[c].flipLeaf || (a.hinge === 'left' && (doorType !== 'doubleSwing' && doorType !== 'doubleSwingDoubleFix'))) {
          rotationOffset = -frameLength - leafLength - prevLeafs
        } else {
          rotationOffset = -frameLength - prevLeafs
          sinAngle = -sinAngle
        }

        // rotation of leaf vertices
        for (i = lvs; i < lve - 2; i = i + 3) {
          xRotate = leafVertices[i] + rotationOffset
          leafVertices[i + 2] = leafVertices[i + 2] - wallBackPos + leafOffset + frameOffset
          leafVertices[i] = xRotate * cosAngle - leafVertices[i + 2] * sinAngle - rotationOffset
          leafVertices[i + 2] = leafVertices[i + 2] * cosAngle + xRotate * sinAngle + wallBackPos - leafOffset - frameOffset
        }
        // rotation of handle vertices
        for (i = hvs; i < hvf - 2; i = i + 3) {
          xRotate = handleVertices[i] + rotationOffset
          handleVertices[i + 2] = handleVertices[i + 2] - wallBackPos + leafOffset + frameOffset
          handleVertices[i] = xRotate * cosAngle - handleVertices[i + 2] * sinAngle - rotationOffset
          handleVertices[i + 2] = handleVertices[i + 2] * cosAngle + xRotate * sinAngle + wallBackPos - leafOffset - frameOffset
        }
      }
      xCursor += leafLength
    }

    var i,
      ll = leafVertices.length,
      lh = handleVertices.length

    // rotate everything by PI if door is set to front

    if (a.side === 'front') {
      for (i = 0; i < ll; i = i + 3) {
        xRotate = leafVertices[i] - frameLength - doorOpening / 2
        leafVertices[i + 2] = leafVertices[i + 2] - wallBackPos - leafOffset / 2 - frameOffset / 2 - frameWidth / 2
        leafVertices[i] = -xRotate + frameLength + doorOpening / 2
        leafVertices[i + 2] = -leafVertices[i + 2] + wallBackPos - leafOffset / 2 - frameOffset / 2 + frameWidth / 2
      }
      for (i = 0; i < lh; i = i + 3) {
        xRotate = handleVertices[i] - frameLength - doorOpening / 2
        handleVertices[i + 2] = handleVertices[i + 2] - wallBackPos - leafOffset / 2 - frameOffset / 2 - frameWidth / 2
        handleVertices[i] = -xRotate + frameLength + doorOpening / 2
        handleVertices[i + 2] = -handleVertices[i + 2] + wallBackPos - leafOffset / 2 - frameOffset / 2 + frameWidth / 2
      }
    }

    return {
      frame: {
        positions: frameVertices,
        normals: generateNormals.flat(frameVertices),
        material: 'frame'
      },
      handle: {
        positions: new Float32Array(handleVertices),
        normals: generateNormals.flat(handleVertices),
        material: 'handle'
      },
      leaf: {
        positions: new Float32Array(leafVertices),
        normals: generateNormals.flat(leafVertices),
        uvs: new Float32Array(leafUvs),
        material: 'leaf'
      },
      threshold: {
        positions: floorVertices,
        normals: generateNormals.flat(floorVertices),
        uvs: floorUvs,
        material: 'threshold'
      }
    }
  }
}