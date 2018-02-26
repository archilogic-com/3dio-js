'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getPic from './common/get-pic.js'
import picLib from './common/pic-lib.js'
import getMaterial from './common/get-material.js'
import updateSchema from './common/update-schema.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'

export default {

  schema: getSchema('pic'),

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
    var materials = this.generateMaterials()

    // clean up empty meshes to prevent errors
    var meshKeys = Object.keys(meshes)
    meshKeys.forEach(key => {
      if (!meshes[key].positions || !meshes[key].positions.length) {
        // console.warn('no vertices for mesh', key)
        delete meshes[key]
      }
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

  generateMaterials: function() {
    // setup materials
    // defaults

    var frameMat = {
      "white":   {
        colorDiffuse: [0.95, 0.95, 0.95],
        colorSpecular: [0.1, 0.1, 0.1],
        specularCoef: 30
      },
      "black":   {
        colorDiffuse: [0.1, 0.1, 0.1],
        colorSpecular: [0.4, 0.4, 0.4],
        specularCoef: 30
      }
    }

    // check if picture fits frame
    var imgKeys = Object.keys(picLib[this.attributes.picFormat])
    
    if (imgKeys.indexOf(this.attributes.picture) < 0) {
      // pic random new one
      var randomKey = imgKeys[Math.floor(Math.random() * imgKeys.length)]
      this.attributes.picture = randomKey
      // apply new random picture to element
      if (this.el) this.el.setAttribute('io3d-pic', {picture: randomKey})
    }
    var imgMat = getPic(this.attributes.picFormat, this.attributes.picture)
    imgMat.colorSpecular = [0.2, 0.2, 0.2]
    imgMat.specularCoef = 20

    var materials = {
      frame: frameMat[this.attributes.frameMat],
      mat: {
        colorDiffuse: [1, 1, 1],
        colorSpecular: [0.36, 0.36, 0.36],
        specularCoef: 30
      },
      pic: imgMat
    }

    return materials
  },

  generateMeshes3d: function () {
    var a = this.attributes

    // initial cursor positions (yCursor at the top, xCursor at the left)
    var frameFacesCount = a.picType === 'framed' ? 24 : 0,
      frameVertices = new Float32Array(frameFacesCount * 9),
      fvPos = 0,
      picFaces = a.picType === 'canvas' ? 10 : 2,
      picVertices = new Float32Array(picFaces * 9),
      pvPos = 0,
      picUvs = new Float32Array(picFaces * 6),
      pvUvPos = 0,
      matFaces = a.picType === 'canvas' ? 2 : 10,
      matVertices = new Float32Array(matFaces * 9),
      mvPos = 0,
      picLength,
      picHeight,
      frameLength = a.picType === 'framed' ? a.frameLength : 0,
      matLength = a.picType !== 'canvas' ? a.mat : 0,
      images = picLib
    
    if (a.picFormat === 'panorama') {
      picLength = parseFloat(a.picSize) //a.picSize -2 * a.mat -2 * a.frameLength
      picHeight = Math.round((picLength / 3 * 2)*10)/10
    } else {
      picHeight = parseFloat(a.picSize) //a.picSize -2 * a.mat -2 * a.frameLength
      picLength = Math.round((picHeight / 3 * 2)*10)/10
    }
    
    //frame BOX

    // FRONT VIEW FRAME VERTICES
    //
    // A/E---------C/G
    //  | I/M---K/O |
    //  | |      |  |
    //  | J/N---L/P |
    // B/F---------D/H

    // MAT + PIC VERTICES
    //
    //  M----------O
    //  | Q------S |
    //  | |      | |
    //  | R------T |
    //  N----------P
    var 
      frameMargin = 2 * matLength + 2 * frameLength,
      imgHeight = picHeight + frameMargin,
      imgLength = picLength + frameMargin
    
    //console.log('margin', frameMargin, matLength, frameLength)
    //console.log('img', imgLength, imgHeight, 'pic', picLength, picHeight)  
      
    a.w = a.picType === 'poster' ? 0.002 : a.picType === 'canvas' ? 0.02 : 0.04

    var aX = -imgLength / 2,
      aY = a.h + imgHeight / 2,
      aZ = a.w,
      bY = aY - imgHeight,
      cX = aX + imgLength,
      eZ = 0,
      iX = aX + frameLength,
      iY = aY - frameLength,
      jY = bY + frameLength,
      kX = cX - frameLength,
      mZ = a.picType === 'canvas' ? a.w : a.w / 2,
      qX = iX + matLength,
      qY = iY - matLength,
      rY = jY + matLength,
      sX = kX - matLength 

    if (a.picType === 'framed') {

      //E
      frameVertices[fvPos] = frameVertices[fvPos+9] = aX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = aY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = eZ
      //F
      frameVertices[fvPos+3] = aX
      frameVertices[fvPos+4] = bY
      frameVertices[fvPos+5] = eZ
      //B
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = aX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = bY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //A
      frameVertices[fvPos+15] = aX
      frameVertices[fvPos+16] = aY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //E
      frameVertices[fvPos] = frameVertices[fvPos+9] = aX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = aY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = eZ
      //A
      frameVertices[fvPos+3] = aX
      frameVertices[fvPos+4] = aY
      frameVertices[fvPos+5] = aZ
      //C
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = cX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = aY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //G
      frameVertices[fvPos+15] = cX
      frameVertices[fvPos+16] = aY
      frameVertices[fvPos+17] = eZ
  
      fvPos = fvPos+18
  
      //C
      frameVertices[fvPos] = frameVertices[fvPos+9] = cX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = aY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //D
      frameVertices[fvPos+3] = cX
      frameVertices[fvPos+4] = bY
      frameVertices[fvPos+5] = aZ
      //H
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = cX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = bY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = eZ
      //G
      frameVertices[fvPos+15] = cX
      frameVertices[fvPos+16] = aY
      frameVertices[fvPos+17] = eZ
  
      fvPos = fvPos+18
  
      //B
      frameVertices[fvPos] = frameVertices[fvPos+9] = aX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = bY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //F
      frameVertices[fvPos+3] = aX
      frameVertices[fvPos+4] = bY
      frameVertices[fvPos+5] = eZ
      //D
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = cX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = bY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = eZ
      //H
      frameVertices[fvPos+15] = cX
      frameVertices[fvPos+16] = bY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //A
      frameVertices[fvPos] = frameVertices[fvPos+9] = aX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = aY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //B
      frameVertices[fvPos+3] = aX
      frameVertices[fvPos+4] = bY
      frameVertices[fvPos+5] = aZ
      //J
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = iX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = jY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //I
      frameVertices[fvPos+15] = iX
      frameVertices[fvPos+16] = iY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //A
      frameVertices[fvPos] = frameVertices[fvPos+9] = aX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = aY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //I
      frameVertices[fvPos+3] = iX
      frameVertices[fvPos+4] = iY
      frameVertices[fvPos+5] = aZ
      //K
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = kX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = iY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //C
      frameVertices[fvPos+15] = cX
      frameVertices[fvPos+16] = aY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //K
      frameVertices[fvPos] = frameVertices[fvPos+9] = kX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = iY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //L
      frameVertices[fvPos+3] = kX
      frameVertices[fvPos+4] = jY
      frameVertices[fvPos+5] = aZ
      //D
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = cX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = bY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //C
      frameVertices[fvPos+15] = cX
      frameVertices[fvPos+16] = aY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //J
      frameVertices[fvPos] = frameVertices[fvPos+9] = iX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = jY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //B
      frameVertices[fvPos+3] = aX
      frameVertices[fvPos+4] = bY
      frameVertices[fvPos+5] = aZ
      //D
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = cX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = bY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //L
      frameVertices[fvPos+15] = kX
      frameVertices[fvPos+16] = jY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //I
      frameVertices[fvPos] = frameVertices[fvPos+9] = iX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = iY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //J
      frameVertices[fvPos+3] = iX
      frameVertices[fvPos+4] = jY
      frameVertices[fvPos+5] = aZ
      //N
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = iX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = jY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = mZ
      //M
      frameVertices[fvPos+15] = iX
      frameVertices[fvPos+16] = iY
      frameVertices[fvPos+17] = mZ
  
      fvPos = fvPos+18
  
      //I
      frameVertices[fvPos] = frameVertices[fvPos+9] = iX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = iY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = aZ
      //M
      frameVertices[fvPos+3] = iX
      frameVertices[fvPos+4] = iY
      frameVertices[fvPos+5] = mZ
      //O
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = kX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = iY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = mZ
      //K
      frameVertices[fvPos+15] = kX
      frameVertices[fvPos+16] = iY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //O
      frameVertices[fvPos] = frameVertices[fvPos+9] = kX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = iY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = mZ
      //P
      frameVertices[fvPos+3] = kX
      frameVertices[fvPos+4] = jY
      frameVertices[fvPos+5] = mZ
      //L
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = kX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = jY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //K
      frameVertices[fvPos+15] = kX
      frameVertices[fvPos+16] = iY
      frameVertices[fvPos+17] = aZ
  
      fvPos = fvPos+18
  
      //N
      frameVertices[fvPos] = frameVertices[fvPos+9] = iX
      frameVertices[fvPos+1] = frameVertices[fvPos+10] = jY
      frameVertices[fvPos+2] = frameVertices[fvPos+11] = mZ
      //J
      frameVertices[fvPos+3] = iX
      frameVertices[fvPos+4] = jY
      frameVertices[fvPos+5] = aZ
      //L
      frameVertices[fvPos+6] = frameVertices[fvPos+12] = kX
      frameVertices[fvPos+7] = frameVertices[fvPos+13] = jY
      frameVertices[fvPos+8] = frameVertices[fvPos+14] = aZ
      //P
      frameVertices[fvPos+15] = kX
      frameVertices[fvPos+16] = jY
      frameVertices[fvPos+17] = mZ
    
    }

    // IMAGE

    //Q
    picVertices[pvPos] = picVertices[pvPos+9] = qX
    picVertices[pvPos+1] = picVertices[pvPos+10] = qY
    picVertices[pvPos+2] = picVertices[pvPos+11] = mZ
    //R
    picVertices[pvPos+3] = qX
    picVertices[pvPos+4] = rY
    picVertices[pvPos+5] = mZ
    //T
    picVertices[pvPos+6] = picVertices[pvPos+12] = sX
    picVertices[pvPos+7] = picVertices[pvPos+13] = rY
    picVertices[pvPos+8] = picVertices[pvPos+14] = mZ
    //S
    picVertices[pvPos+15] = sX
    picVertices[pvPos+16] = qY
    picVertices[pvPos+17] = mZ

    picUvs [pvUvPos] = picUvs [pvUvPos + 2] = picUvs [pvUvPos + 6] = 0 //x1
    picUvs [pvUvPos + 1] = picUvs [pvUvPos + 7] = picUvs [pvUvPos + 11] = 1 //y1
    picUvs [pvUvPos + 3] = picUvs [pvUvPos + 5] = picUvs [pvUvPos + 9] = 0 //y2
    picUvs [pvUvPos + 4] = picUvs [pvUvPos + 8] = picUvs [pvUvPos + 10] = 1 //x2
    
    if (a.picType === 'canvas') {
      // Canvas Top
      pvPos += 18
      //Q-
      picVertices[pvPos] = picVertices[pvPos+9] = qX
      picVertices[pvPos+1] = picVertices[pvPos+10] = qY
      picVertices[pvPos+2] = picVertices[pvPos+11] = eZ
      //Q
      picVertices[pvPos+3] = qX
      picVertices[pvPos+4] = qY
      picVertices[pvPos+5] = mZ
      //S
      picVertices[pvPos+6] = picVertices[pvPos+12] = sX
      picVertices[pvPos+7] = picVertices[pvPos+13] = qY
      picVertices[pvPos+8] = picVertices[pvPos+14] = mZ
      //S-
      picVertices[pvPos+15] = sX
      picVertices[pvPos+16] = qY
      picVertices[pvPos+17] = eZ
      
      pvUvPos += 12
      
      picUvs [pvUvPos] = picUvs [pvUvPos + 2] = picUvs [pvUvPos + 6] = 0 //x1
      picUvs [pvUvPos + 1] = picUvs [pvUvPos + 7] = picUvs [pvUvPos + 11] = -a.w //y1
      picUvs [pvUvPos + 3] = picUvs [pvUvPos + 5] = picUvs [pvUvPos + 9] = 0 //y2
      picUvs [pvUvPos + 4] = picUvs [pvUvPos + 8] = picUvs [pvUvPos + 10] = 1 //x2
      
      // Canvas Left
      pvPos += 18
      //Q-
      picVertices[pvPos] = picVertices[pvPos+9] = qX
      picVertices[pvPos+1] = picVertices[pvPos+10] = qY
      picVertices[pvPos+2] = picVertices[pvPos+11] = eZ
      //R-
      picVertices[pvPos+3] = qX
      picVertices[pvPos+4] = rY
      picVertices[pvPos+5] = eZ
      //R
      picVertices[pvPos+6] = picVertices[pvPos+12] = qX
      picVertices[pvPos+7] = picVertices[pvPos+13] = rY
      picVertices[pvPos+8] = picVertices[pvPos+14] = mZ
      //Q
      picVertices[pvPos+15] = qX
      picVertices[pvPos+16] = qY
      picVertices[pvPos+17] = mZ
      
      pvUvPos += 12
      
      picUvs [pvUvPos] = picUvs [pvUvPos + 2] = picUvs [pvUvPos + 6] = a.w //x1
      picUvs [pvUvPos + 1] = picUvs [pvUvPos + 7] = picUvs [pvUvPos + 11] = 1 //y1
      picUvs [pvUvPos + 3] = picUvs [pvUvPos + 5] = picUvs [pvUvPos + 9] = 0 //y2
      picUvs [pvUvPos + 4] = picUvs [pvUvPos + 8] = picUvs [pvUvPos + 10] = 0 //x2
      
      // Canvas Bottom
      pvPos += 18
      //R
      picVertices[pvPos] = picVertices[pvPos+9] = qX
      picVertices[pvPos+1] = picVertices[pvPos+10] = rY
      picVertices[pvPos+2] = picVertices[pvPos+11] = mZ
      //R-
      picVertices[pvPos+3] = qX
      picVertices[pvPos+4] = rY
      picVertices[pvPos+5] = eZ
      //T-
      picVertices[pvPos+6] = picVertices[pvPos+12] = sX
      picVertices[pvPos+7] = picVertices[pvPos+13] = rY
      picVertices[pvPos+8] = picVertices[pvPos+14] = eZ
      //T
      picVertices[pvPos+15] = sX
      picVertices[pvPos+16] = rY
      picVertices[pvPos+17] = mZ
      
      pvUvPos += 12
      
      picUvs [pvUvPos] = picUvs [pvUvPos + 2] = picUvs [pvUvPos + 6] = 0 //x1
      picUvs [pvUvPos + 1] = picUvs [pvUvPos + 7] = picUvs [pvUvPos + 11] = 0 //y1
      picUvs [pvUvPos + 3] = picUvs [pvUvPos + 5] = picUvs [pvUvPos + 9] = a.w //y2
      picUvs [pvUvPos + 4] = picUvs [pvUvPos + 8] = picUvs [pvUvPos + 10] = 1 //x2
      
            
      // Canvas Right
      pvPos += 18
      //S
      picVertices[pvPos] = picVertices[pvPos+9] = sX
      picVertices[pvPos+1] = picVertices[pvPos+10] = qY
      picVertices[pvPos+2] = picVertices[pvPos+11] = mZ
      //T
      picVertices[pvPos+3] = sX
      picVertices[pvPos+4] = rY
      picVertices[pvPos+5] = mZ
      //T-
      picVertices[pvPos+6] = picVertices[pvPos+12] = sX
      picVertices[pvPos+7] = picVertices[pvPos+13] = rY
      picVertices[pvPos+8] = picVertices[pvPos+14] = eZ
      //S-
      picVertices[pvPos+15] = sX
      picVertices[pvPos+16] = qY
      picVertices[pvPos+17] = eZ
      
      pvUvPos += 12
      
      picUvs [pvUvPos] = picUvs [pvUvPos + 2] = picUvs [pvUvPos + 6] = 0 //x1
      picUvs [pvUvPos + 1] = picUvs [pvUvPos + 7] = picUvs [pvUvPos + 11] = 1 //y1
      picUvs [pvUvPos + 3] = picUvs [pvUvPos + 5] = picUvs [pvUvPos + 9] = 0 //y2
      picUvs [pvUvPos + 4] = picUvs [pvUvPos + 8] = picUvs [pvUvPos + 10] = -a.w //x2
    
    }

    if (a.picType !== 'canvas') {
    // MAT
  
      //M
      matVertices[mvPos] = matVertices[mvPos+9] = iX
      matVertices[mvPos+1] = matVertices[mvPos+10] = iY
      matVertices[mvPos+2] = matVertices[mvPos+11] = mZ
      //N
      matVertices[mvPos+3] = iX
      matVertices[mvPos+4] = jY
      matVertices[mvPos+5] = mZ
      //R
      matVertices[mvPos+6] = matVertices[mvPos+12] = qX
      matVertices[mvPos+7] = matVertices[mvPos+13] = rY
      matVertices[mvPos+8] = matVertices[mvPos+14] = mZ
      //Q
      matVertices[mvPos+15] = qX
      matVertices[mvPos+16] = qY
      matVertices[mvPos+17] = mZ
  
      mvPos = mvPos+18
  
      //R
      matVertices[mvPos] = matVertices[mvPos+9] = qX
      matVertices[mvPos+1] = matVertices[mvPos+10] = rY
      matVertices[mvPos+2] = matVertices[mvPos+11] = mZ
      //N
      matVertices[mvPos+3] = iX
      matVertices[mvPos+4] = jY
      matVertices[mvPos+5] = mZ
      //P
      matVertices[mvPos+6] = matVertices[mvPos+12] = kX
      matVertices[mvPos+7] = matVertices[mvPos+13] = jY
      matVertices[mvPos+8] = matVertices[mvPos+14] = mZ
      //T
      matVertices[mvPos+15] = sX
      matVertices[mvPos+16] = rY
      matVertices[mvPos+17] = mZ
  
      mvPos = mvPos+18
  
      //S
      matVertices[mvPos] = matVertices[mvPos+9] = sX
      matVertices[mvPos+1] = matVertices[mvPos+10] = qY
      matVertices[mvPos+2] = matVertices[mvPos+11] = mZ
      //T
      matVertices[mvPos+3] = sX
      matVertices[mvPos+4] = rY
      matVertices[mvPos+5] = mZ
      //P
      matVertices[mvPos+6] = matVertices[mvPos+12] = kX
      matVertices[mvPos+7] = matVertices[mvPos+13] = jY
      matVertices[mvPos+8] = matVertices[mvPos+14] = mZ
      //O
      matVertices[mvPos+15] = kX
      matVertices[mvPos+16] = iY
      matVertices[mvPos+17] = mZ
  
      mvPos = mvPos+18
  
      //M
      matVertices[mvPos] = matVertices[mvPos+9] = iX
      matVertices[mvPos+1] = matVertices[mvPos+10] = iY
      matVertices[mvPos+2] = matVertices[mvPos+11] = mZ
      //Q
      matVertices[mvPos+3] = qX
      matVertices[mvPos+4] = qY
      matVertices[mvPos+5] = mZ
      //S
      matVertices[mvPos+6] = matVertices[mvPos+12] = sX
      matVertices[mvPos+7] = matVertices[mvPos+13] = qY
      matVertices[mvPos+8] = matVertices[mvPos+14] = mZ
      //O
      matVertices[mvPos+15] = kX
      matVertices[mvPos+16] = iY
      matVertices[mvPos+17] = mZ
      
      // picture backface
      
      mvPos = mvPos+18
    
    }

    //G
    matVertices[mvPos] = matVertices[mvPos+9] = cX
    matVertices[mvPos+1] = matVertices[mvPos+10] = aY
    matVertices[mvPos+2] = matVertices[mvPos+11] = eZ
    //H
    matVertices[mvPos+3] = cX
    matVertices[mvPos+4] = bY
    matVertices[mvPos+5] = eZ
    //F
    matVertices[mvPos+6] = matVertices[mvPos+12] = aX
    matVertices[mvPos+7] = matVertices[mvPos+13] = bY
    matVertices[mvPos+8] = matVertices[mvPos+14] = eZ
    //E
    matVertices[mvPos+15] = aX
    matVertices[mvPos+16] = aY
    matVertices[mvPos+17] = eZ

    // return meshes
    return {
      frame: {
        positions: frameVertices,
        normals: generateNormals.flat(frameVertices),
        material: 'frame'
      },
      mat: {
        positions: matVertices,
        normals: generateNormals.flat(matVertices),
        material: 'mat'
      },
      pic: {
        positions: new Float32Array(picVertices),
        normals: generateNormals.flat(picVertices),
        uvs: picUvs,
        material: 'pic'
      }
    }
    
  }
}