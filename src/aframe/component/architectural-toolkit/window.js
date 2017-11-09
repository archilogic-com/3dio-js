'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'

export default {

  schema: getSchema('window'),

  init: function () {},

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
        colorDiffuse: [0.85, 0.85, 0.85]
      },
      glass: 'glass'
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

    var rowRatios = a.rowRatios
    var columnRatios = a.columnRatios
    var frameLength = a.frameLength
    var frameWidth = a.frameWidth

    // internals

    // initial cursor positions (yCursor at the top, xCursor at the left)
    var yCursor = a.h
    var xCursor = 0

    var evenFrameHeight = a.h - frameLength
    var evenFrameLength = a.l - frameLength

    var rLen = rowRatios.length
    var cLen

    var rowSegments = 0
    var columnSegments = []

    var frameFacesCount = rLen * 4 + 18
    var glassFacesCount = 0

    for (var r = 0; r < rLen; r++) {
      rowSegments += rowRatios[ r ]
      columnSegments[ r ] = 0
      cLen = columnRatios[ r ].length
      frameFacesCount += (cLen - 1) * 4 + cLen * 8
      glassFacesCount += cLen * 4
      for (var c = 0; c < cLen; c++) {
        columnSegments[ r ] += columnRatios[ r ][ c ]
      }
    }

    var segmentLength
    var segmentHeight = evenFrameHeight / rowSegments

    var frameVertices = new Float32Array(frameFacesCount * 9)
    var fvPos = 0

    var glassVertices = new Float32Array(glassFacesCount * 9)
    var gvPos = 0

    // iterate
    for (var r = 0; r < rLen; r++) {

      cLen = columnRatios[ r ].length
      segmentLength = evenFrameLength / columnSegments[ r ]

      // horizontal bar quad

      frameVertices[ fvPos ] = frameLength
      frameVertices[ fvPos + 1 ] = yCursor
      frameVertices[ fvPos + 2 ] = 0
      frameVertices[ fvPos + 3 ] = evenFrameLength
      frameVertices[ fvPos + 4 ] = yCursor - frameLength
      frameVertices[ fvPos + 5 ] = 0
      frameVertices[ fvPos + 6 ] = frameLength
      frameVertices[ fvPos + 7 ] = yCursor - frameLength
      frameVertices[ fvPos + 8 ] = 0

      frameVertices[ fvPos + 9 ] = evenFrameLength
      frameVertices[ fvPos + 10 ] = yCursor - frameLength
      frameVertices[ fvPos + 11 ] = 0
      frameVertices[ fvPos + 12 ] = frameLength
      frameVertices[ fvPos + 13 ] = yCursor
      frameVertices[ fvPos + 14 ] = 0
      frameVertices[ fvPos + 15 ] = evenFrameLength
      frameVertices[ fvPos + 16 ] = yCursor
      frameVertices[ fvPos + 17 ] = 0

      frameVertices[ fvPos + 18 ] = frameLength
      frameVertices[ fvPos + 19 ] = yCursor
      frameVertices[ fvPos + 20 ] = frameWidth
      frameVertices[ fvPos + 21 ] = frameLength
      frameVertices[ fvPos + 22 ] = yCursor - frameLength
      frameVertices[ fvPos + 23 ] = frameWidth
      frameVertices[ fvPos + 24 ] = evenFrameLength
      frameVertices[ fvPos + 25 ] = yCursor - frameLength
      frameVertices[ fvPos + 26 ] = frameWidth

      frameVertices[ fvPos + 27 ] = evenFrameLength
      frameVertices[ fvPos + 28 ] = yCursor - frameLength
      frameVertices[ fvPos + 29 ] = frameWidth
      frameVertices[ fvPos + 30 ] = evenFrameLength
      frameVertices[ fvPos + 31 ] = yCursor
      frameVertices[ fvPos + 32 ] = frameWidth
      frameVertices[ fvPos + 33 ] = frameLength
      frameVertices[ fvPos + 34 ] = yCursor
      frameVertices[ fvPos + 35 ] = frameWidth

      fvPos += 36
      yCursor -= frameLength

      // vertical bars

      for (var c = 0; c < cLen - 1; c++) {

        // move xCursor to the right
        xCursor += segmentLength * columnRatios[ r ][ c ]

        // vertical bar quad

        frameVertices[ fvPos ] = xCursor
        frameVertices[ fvPos + 1 ] = yCursor
        frameVertices[ fvPos + 2 ] = 0
        frameVertices[ fvPos + 3 ] = xCursor + frameLength
        frameVertices[ fvPos + 4 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 5 ] = 0
        frameVertices[ fvPos + 6 ] = xCursor
        frameVertices[ fvPos + 7 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 8 ] = 0

        frameVertices[ fvPos + 9 ] = xCursor + frameLength
        frameVertices[ fvPos + 10 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 11 ] = 0
        frameVertices[ fvPos + 12 ] = xCursor
        frameVertices[ fvPos + 13 ] = yCursor
        frameVertices[ fvPos + 14 ] = 0
        frameVertices[ fvPos + 15 ] = xCursor + frameLength
        frameVertices[ fvPos + 16 ] = yCursor
        frameVertices[ fvPos + 17 ] = 0

        frameVertices[ fvPos + 18 ] = xCursor
        frameVertices[ fvPos + 19 ] = yCursor
        frameVertices[ fvPos + 20 ] = frameWidth
        frameVertices[ fvPos + 21 ] = xCursor
        frameVertices[ fvPos + 22 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 23 ] = frameWidth
        frameVertices[ fvPos + 24 ] = xCursor + frameLength
        frameVertices[ fvPos + 25 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 26 ] = frameWidth

        frameVertices[ fvPos + 27 ] = xCursor + frameLength
        frameVertices[ fvPos + 28 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 29 ] = frameWidth
        frameVertices[ fvPos + 30 ] = xCursor + frameLength
        frameVertices[ fvPos + 31 ] = yCursor
        frameVertices[ fvPos + 32 ] = frameWidth
        frameVertices[ fvPos + 33 ] = xCursor
        frameVertices[ fvPos + 34 ] = yCursor
        frameVertices[ fvPos + 35 ] = frameWidth

        fvPos += 36

      }

      // glass & extrusions
      xCursor = 0
      for (var c = 0; c < cLen; c++) {

        // glass quad

        glassVertices[ gvPos ] = xCursor + frameLength
        glassVertices[ gvPos + 1 ] = yCursor
        glassVertices[ gvPos + 2 ] = 0
        glassVertices[ gvPos + 3 ] = xCursor + frameLength
        glassVertices[ gvPos + 4 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        glassVertices[ gvPos + 5 ] = 0
        glassVertices[ gvPos + 6 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        glassVertices[ gvPos + 7 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        glassVertices[ gvPos + 8 ] = 0

        glassVertices[ gvPos + 9 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        glassVertices[ gvPos + 10 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        glassVertices[ gvPos + 11 ] = 0
        glassVertices[ gvPos + 12 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        glassVertices[ gvPos + 13 ] = yCursor
        glassVertices[ gvPos + 14 ] = 0
        glassVertices[ gvPos + 15 ] = xCursor + frameLength
        glassVertices[ gvPos + 16 ] = yCursor
        glassVertices[ gvPos + 17 ] = 0

        gvPos += 18

        glassVertices[ gvPos ] = xCursor + frameLength
        glassVertices[ gvPos + 1 ] = yCursor
        glassVertices[ gvPos + 2 ] = 0
        glassVertices[ gvPos + 3 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        glassVertices[ gvPos + 4 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        glassVertices[ gvPos + 5 ] = 0
        glassVertices[ gvPos + 6 ] = xCursor + frameLength
        glassVertices[ gvPos + 7 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        glassVertices[ gvPos + 8 ] = 0

        glassVertices[ gvPos + 9 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        glassVertices[ gvPos + 10 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        glassVertices[ gvPos + 11 ] = 0
        glassVertices[ gvPos + 12 ] = xCursor + frameLength
        glassVertices[ gvPos + 13 ] = yCursor
        glassVertices[ gvPos + 14 ] = 0
        glassVertices[ gvPos + 15 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        glassVertices[ gvPos + 16 ] = yCursor
        glassVertices[ gvPos + 17 ] = 0

        gvPos += 18

        // left side extrusion

        frameVertices[ fvPos ] = xCursor + frameLength
        frameVertices[ fvPos + 1 ] = yCursor
        frameVertices[ fvPos + 2 ] = 0
        frameVertices[ fvPos + 3 ] = xCursor + frameLength
        frameVertices[ fvPos + 4 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 5 ] = frameWidth
        frameVertices[ fvPos + 6 ] = xCursor + frameLength
        frameVertices[ fvPos + 7 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 8 ] = 0

        frameVertices[ fvPos + 9 ] = xCursor + frameLength
        frameVertices[ fvPos + 10 ] = yCursor
        frameVertices[ fvPos + 11 ] = 0
        frameVertices[ fvPos + 12 ] = xCursor + frameLength
        frameVertices[ fvPos + 13 ] = yCursor
        frameVertices[ fvPos + 14 ] = frameWidth
        frameVertices[ fvPos + 15 ] = xCursor + frameLength
        frameVertices[ fvPos + 16 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 17 ] = frameWidth

        fvPos += 18

        // bottom side extrusion

        frameVertices[ fvPos ] = xCursor + frameLength
        frameVertices[ fvPos + 1 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 2 ] = 0
        frameVertices[ fvPos + 3 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        frameVertices[ fvPos + 4 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 5 ] = frameWidth
        frameVertices[ fvPos + 6 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        frameVertices[ fvPos + 7 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 8 ] = 0

        frameVertices[ fvPos + 9 ] = xCursor + frameLength
        frameVertices[ fvPos + 10 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 11 ] = 0
        frameVertices[ fvPos + 12 ] = xCursor + frameLength
        frameVertices[ fvPos + 13 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 14 ] = frameWidth
        frameVertices[ fvPos + 15 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        frameVertices[ fvPos + 16 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 17 ] = frameWidth

        fvPos += 18

        // top side extrusion

        frameVertices[ fvPos ] = xCursor + frameLength
        frameVertices[ fvPos + 1 ] = yCursor
        frameVertices[ fvPos + 2 ] = 0
        frameVertices[ fvPos + 3 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        frameVertices[ fvPos + 4 ] = yCursor
        frameVertices[ fvPos + 5 ] = 0
        frameVertices[ fvPos + 6 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        frameVertices[ fvPos + 7 ] = yCursor
        frameVertices[ fvPos + 8 ] = frameWidth

        frameVertices[ fvPos + 9 ] = xCursor + frameLength
        frameVertices[ fvPos + 10 ] = yCursor
        frameVertices[ fvPos + 11 ] = 0
        frameVertices[ fvPos + 12 ] = xCursor + segmentLength * columnRatios[ r ][ c ]
        frameVertices[ fvPos + 13 ] = yCursor
        frameVertices[ fvPos + 14 ] = frameWidth
        frameVertices[ fvPos + 15 ] = xCursor + frameLength
        frameVertices[ fvPos + 16 ] = yCursor
        frameVertices[ fvPos + 17 ] = frameWidth

        fvPos += 18

        // move xCursor to the right
        xCursor += segmentLength * columnRatios[ r ][ c ]

        // right side extrusion

        frameVertices[ fvPos ] = xCursor
        frameVertices[ fvPos + 1 ] = yCursor
        frameVertices[ fvPos + 2 ] = 0
        frameVertices[ fvPos + 3 ] = xCursor
        frameVertices[ fvPos + 4 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 5 ] = 0
        frameVertices[ fvPos + 6 ] = xCursor
        frameVertices[ fvPos + 7 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 8 ] = frameWidth

        frameVertices[ fvPos + 9 ] = xCursor
        frameVertices[ fvPos + 10 ] = yCursor
        frameVertices[ fvPos + 11 ] = 0
        frameVertices[ fvPos + 12 ] = xCursor
        frameVertices[ fvPos + 13 ] = yCursor - segmentHeight * rowRatios[ r ] + frameLength
        frameVertices[ fvPos + 14 ] = frameWidth
        frameVertices[ fvPos + 15 ] = xCursor
        frameVertices[ fvPos + 16 ] = yCursor
        frameVertices[ fvPos + 17 ] = frameWidth

        fvPos += 18

      }

      // reset xCursor, move yCursor downwards
      xCursor = 0
      yCursor -= segmentHeight * rowRatios[ r ] - frameLength

    }

    // add last horizontal frame bar quad

    frameVertices[ fvPos ] = frameLength
    frameVertices[ fvPos + 1 ] = yCursor
    frameVertices[ fvPos + 2 ] = 0
    frameVertices[ fvPos + 3 ] = evenFrameLength
    frameVertices[ fvPos + 4 ] = yCursor - frameLength
    frameVertices[ fvPos + 5 ] = 0
    frameVertices[ fvPos + 6 ] = frameLength
    frameVertices[ fvPos + 7 ] = yCursor - frameLength
    frameVertices[ fvPos + 8 ] = 0

    frameVertices[ fvPos + 9 ] = evenFrameLength
    frameVertices[ fvPos + 10 ] = yCursor - frameLength
    frameVertices[ fvPos + 11 ] = 0
    frameVertices[ fvPos + 12 ] = frameLength
    frameVertices[ fvPos + 13 ] = yCursor
    frameVertices[ fvPos + 14 ] = 0
    frameVertices[ fvPos + 15 ] = evenFrameLength
    frameVertices[ fvPos + 16 ] = yCursor
    frameVertices[ fvPos + 17 ] = 0

    frameVertices[ fvPos + 18 ] = frameLength
    frameVertices[ fvPos + 19 ] = yCursor
    frameVertices[ fvPos + 20 ] = frameWidth
    frameVertices[ fvPos + 21 ] = frameLength
    frameVertices[ fvPos + 22 ] = yCursor - frameLength
    frameVertices[ fvPos + 23 ] = frameWidth
    frameVertices[ fvPos + 24 ] = evenFrameLength
    frameVertices[ fvPos + 25 ] = yCursor - frameLength
    frameVertices[ fvPos + 26 ] = frameWidth

    frameVertices[ fvPos + 27 ] = evenFrameLength
    frameVertices[ fvPos + 28 ] = yCursor - frameLength
    frameVertices[ fvPos + 29 ] = frameWidth
    frameVertices[ fvPos + 30 ] = evenFrameLength
    frameVertices[ fvPos + 31 ] = yCursor
    frameVertices[ fvPos + 32 ] = frameWidth
    frameVertices[ fvPos + 33 ] = frameLength
    frameVertices[ fvPos + 34 ] = yCursor
    frameVertices[ fvPos + 35 ] = frameWidth

    fvPos += 36

    // add left frame side quad

    frameVertices[ fvPos ] = 0
    frameVertices[ fvPos + 1 ] = a.h
    frameVertices[ fvPos + 2 ] = 0
    frameVertices[ fvPos + 3 ] = frameLength
    frameVertices[ fvPos + 4 ] = 0
    frameVertices[ fvPos + 5 ] = 0
    frameVertices[ fvPos + 6 ] = 0
    frameVertices[ fvPos + 7 ] = 0
    frameVertices[ fvPos + 8 ] = 0

    frameVertices[ fvPos + 9 ] = frameLength
    frameVertices[ fvPos + 10 ] = 0
    frameVertices[ fvPos + 11 ] = 0
    frameVertices[ fvPos + 12 ] = 0
    frameVertices[ fvPos + 13 ] = a.h
    frameVertices[ fvPos + 14 ] = 0
    frameVertices[ fvPos + 15 ] = frameLength
    frameVertices[ fvPos + 16 ] = a.h
    frameVertices[ fvPos + 17 ] = 0

    frameVertices[ fvPos + 18 ] = 0
    frameVertices[ fvPos + 19 ] = a.h
    frameVertices[ fvPos + 20 ] = frameWidth
    frameVertices[ fvPos + 21 ] = 0
    frameVertices[ fvPos + 22 ] = 0
    frameVertices[ fvPos + 23 ] = frameWidth
    frameVertices[ fvPos + 24 ] = frameLength
    frameVertices[ fvPos + 25 ] = 0
    frameVertices[ fvPos + 26 ] = frameWidth

    frameVertices[ fvPos + 27 ] = frameLength
    frameVertices[ fvPos + 28 ] = 0
    frameVertices[ fvPos + 29 ] = frameWidth
    frameVertices[ fvPos + 30 ] = frameLength
    frameVertices[ fvPos + 31 ] = a.h
    frameVertices[ fvPos + 32 ] = frameWidth
    frameVertices[ fvPos + 33 ] = 0
    frameVertices[ fvPos + 34 ] = a.h
    frameVertices[ fvPos + 35 ] = frameWidth

    fvPos += 36

    // add right frame side quad

    frameVertices[ fvPos ] = evenFrameLength
    frameVertices[ fvPos + 1 ] = a.h
    frameVertices[ fvPos + 2 ] = 0
    frameVertices[ fvPos + 3 ] = a.l
    frameVertices[ fvPos + 4 ] = 0
    frameVertices[ fvPos + 5 ] = 0
    frameVertices[ fvPos + 6 ] = evenFrameLength
    frameVertices[ fvPos + 7 ] = 0
    frameVertices[ fvPos + 8 ] = 0

    frameVertices[ fvPos + 9 ] = a.l
    frameVertices[ fvPos + 10 ] = 0
    frameVertices[ fvPos + 11 ] = 0
    frameVertices[ fvPos + 12 ] = evenFrameLength
    frameVertices[ fvPos + 13 ] = a.h
    frameVertices[ fvPos + 14 ] = 0
    frameVertices[ fvPos + 15 ] = a.l
    frameVertices[ fvPos + 16 ] = a.h
    frameVertices[ fvPos + 17 ] = 0

    frameVertices[ fvPos + 18 ] = evenFrameLength
    frameVertices[ fvPos + 19 ] = a.h
    frameVertices[ fvPos + 20 ] = frameWidth
    frameVertices[ fvPos + 21 ] = evenFrameLength
    frameVertices[ fvPos + 22 ] = 0
    frameVertices[ fvPos + 23 ] = frameWidth
    frameVertices[ fvPos + 24 ] = a.l
    frameVertices[ fvPos + 25 ] = 0
    frameVertices[ fvPos + 26 ] = frameWidth

    frameVertices[ fvPos + 27 ] = a.l
    frameVertices[ fvPos + 28 ] = 0
    frameVertices[ fvPos + 29 ] = frameWidth
    frameVertices[ fvPos + 30 ] = a.l
    frameVertices[ fvPos + 31 ] = a.h
    frameVertices[ fvPos + 32 ] = frameWidth
    frameVertices[ fvPos + 33 ] = evenFrameLength
    frameVertices[ fvPos + 34 ] = a.h
    frameVertices[ fvPos + 35 ] = frameWidth

    fvPos += 36

    // add right outer side squad

    frameVertices[ fvPos ] = a.l
    frameVertices[ fvPos + 1 ] = a.h
    frameVertices[ fvPos + 2 ] = 0
    frameVertices[ fvPos + 3 ] = a.l
    frameVertices[ fvPos + 4 ] = 0
    frameVertices[ fvPos + 5 ] = frameWidth
    frameVertices[ fvPos + 6 ] = a.l
    frameVertices[ fvPos + 7 ] = 0
    frameVertices[ fvPos + 8 ] = 0

    frameVertices[ fvPos + 9 ] = a.l
    frameVertices[ fvPos + 10 ] = a.h
    frameVertices[ fvPos + 11 ] = 0
    frameVertices[ fvPos + 12 ] = a.l
    frameVertices[ fvPos + 13 ] = a.h
    frameVertices[ fvPos + 14 ] = frameWidth
    frameVertices[ fvPos + 15 ] = a.l
    frameVertices[ fvPos + 16 ] = 0
    frameVertices[ fvPos + 17 ] = frameWidth

    fvPos += 18

    // add right outer side squad

    frameVertices[ fvPos ] = 0
    frameVertices[ fvPos + 1 ] = a.h
    frameVertices[ fvPos + 2 ] = 0
    frameVertices[ fvPos + 3 ] = 0
    frameVertices[ fvPos + 4 ] = 0
    frameVertices[ fvPos + 5 ] = 0
    frameVertices[ fvPos + 6 ] = 0
    frameVertices[ fvPos + 7 ] = 0
    frameVertices[ fvPos + 8 ] = frameWidth

    frameVertices[ fvPos + 9 ] = 0
    frameVertices[ fvPos + 10 ] = a.h
    frameVertices[ fvPos + 11 ] = 0
    frameVertices[ fvPos + 12 ] = 0
    frameVertices[ fvPos + 13 ] = 0
    frameVertices[ fvPos + 14 ] = frameWidth
    frameVertices[ fvPos + 15 ] = 0
    frameVertices[ fvPos + 16 ] = a.h
    frameVertices[ fvPos + 17 ] = frameWidth

    fvPos += 18

    // add top outer side squad

    frameVertices[ fvPos ] = 0
    frameVertices[ fvPos + 1 ] = a.h
    frameVertices[ fvPos + 2 ] = 0
    frameVertices[ fvPos + 3 ] = a.l
    frameVertices[ fvPos + 4 ] = a.h
    frameVertices[ fvPos + 5 ] = frameWidth
    frameVertices[ fvPos + 6 ] = a.l
    frameVertices[ fvPos + 7 ] = a.h
    frameVertices[ fvPos + 8 ] = 0

    frameVertices[ fvPos + 9 ] = a.l
    frameVertices[ fvPos + 10 ] = a.h
    frameVertices[ fvPos + 11 ] = frameWidth
    frameVertices[ fvPos + 12 ] = 0
    frameVertices[ fvPos + 13 ] = a.h
    frameVertices[ fvPos + 14 ] = 0
    frameVertices[ fvPos + 15 ] = 0
    frameVertices[ fvPos + 16 ] = a.h
    frameVertices[ fvPos + 17 ] = frameWidth

    // return meshes
    return {
      frame: {
        positions: frameVertices,
        normals: generateNormals.flat(frameVertices),
        material: 'frame'
      },
      glass: {
        positions: glassVertices,
        normals: generateNormals.flat(glassVertices),
        material: 'glass'
      }
    }
  }
}