'use strict';

// dependencies

import generateNormals from '../../../../utils/data3d/buffer/get-normals'

// class

export default {

  params: {
    type: 'window',
    x: 0,
    y: 0.8,
    z: 0,
    ry: 0,
    l: 1.6,        // length
    h: 1.5,        // height
    lock: false,

    bake: true,
    bakeStatus: 'none', // none, pending, done

    rowRatios: [ 1 ],
    columnRatios: [ [ 1 ] ],

    frameLength: 0.04,
    frameWidth: 0.06,

    materials: {
      frame: {
        colorDiffuse: [0.85, 0.85, 0.85]
      },
      glass: 'glass'
    }

  },

  valid: {
    children: [],
    x: {
      step: 0.05
    },
    z: {
      lock: true
    },
    ry: {
      step: 180
    },
    l: {
      min: 0.3,
      step: 0.05
    }
  },

  initialize: function(){

    // backwards compatibility
    if (this.a.frameMaterial) {
      this.a.materials.frame = this.a.frameMaterial
      delete this.a.frameMaterial
    }
    if (this.a.glassMaterial) {
      this.a.materials.glass = this.a.glassMaterial
      delete this.a.glassMaterial
    }
    if (this.a.materials && this.a.materials.frame && this.a.materials.frame.length === 3) {
      // deprecated color format
      this.a.materials.frame = { colorDiffuse: this.a.materials.frame }
    }

  },

  bindings: [{
    events: [
      'change:l',
      'change:w',
      'change:h',
      'change:rowRatios',
      'change:columnRatios',
      'change:frameLength',
      'change:frameWidth'
    ],
    call: 'meshes3d'
  },{
    events: [
      'change:materials.*'
    ],
    call: 'materials3d'
  }],

  _setRatios: function (args) {
    var rowRatios = args.rows || this.a.rowRatios
    var columnRatios = args.columns || this.a.columnRatios
    if (!args.rows) {
      // adapt rows
      var _rowRatios = []
      for (var i = 0, l = columnRatios.length; i < l; i++) {
        if (rowRatios[ i ]) {
          _rowRatios[ i ] = rowRatios[ i ]
        } else {
          _rowRatios[ i ] = 1
        }
      }
      rowRatios = _rowRatios
    } else {
      // adapt columns
      var _columnRatios = []
      for (var i = 0, l = rowRatios.length; i < l; i++) {
        if (columnRatios[ i ]) {
          _columnRatios[ i ] = columnRatios[ i ]
        } else {
          _columnRatios[ i ] = [ 1 ]
        }
      }
      columnRatios = _columnRatios
    }
    this.set({
      rowRatios: rowRatios,
      columnRatios: columnRatios
    })
  },

  contextMenu: function generateContextMenu (){
    var self = this
    return {
      templateId: 'generic',
      templateOptions: {
        title: 'Window'
      },
      controls: [
        {
          title: 'Height',
          type: 'number',
          param: 'h',
          unit: 'm',
          step: 0.05,
          round: 0.01
        },{
          title: 'Length',
          type: 'number',
          param: 'l',
          unit: 'm',
          step: 0.05,
          round: 0.01
        },{
          title: 'Vertical Position',
          type: 'number',
          param: 'y',
          unit: 'm',
          step: 0.1,
          round: 0.01
        },{
          title: 'Border Length',
          type: 'number',
          param: 'frameLength',
          unit: 'm',
          min: 0.02,
          max: 0.2,
          step: 0.01,
          round: 0.01
        },{
          title: 'Border Width',
          type: 'number',
          param: 'frameWidth',
          unit: 'm',
          min: 0.02,
          max: 0.2,
          step: 0.05,
          round: 0.01
        },
        {
          title: 'Row Ratios',
          type: 'text',
          display: function(){
            // encode
            return self.a.rowRatios.join(':')
          },
          onInput: function(value){
            // decode
            var rows = []
            value.split(':').forEach(function(_value, i){
              rows[ i ] = window.Number(_value)
            })
            self._setRatios({ rows: rows })
          },
          bindings: ['change:rowRatios', 'change:columnRatios'],
          realtimeInput: false,
          subscriptions: ['pro', 'modeller', 'artist3d']
        },
        {
          title: 'Column Ratios',
          type: 'text',
          display: function(){
            // encode
            var columns = []
            self.a.columnRatios.forEach(function(row, i){
              columns[ i ] = row.join(':')
            })
            return columns.join('\n')
          },
          onInput: function(value){
            // decode
            var columns = []
            value.split('\n').forEach(function(row, i){
              columns[ i ] = []
              row.split(':').forEach(function(_value, j){
                columns[ i ][ j ] = window.Number(_value)
              })
            })
            self._setRatios({ columns: columns })
          },
          bindings: ['change:rowRatios', 'change:columnRatios'],
          realtimeInput: false,
          multiLine: true,
          subscriptions: ['pro', 'modeller', 'artist3d']
        },
        {
          title: 'Lock this item',
          type: 'boolean',
          param: 'locked',
          subscriptions: ['pro', 'modeller', 'artist3d']
        },
        {
          title: 'Border Material',
          type: 'material',
          param: 'materials.frame',
          mode: 'custom',
          controls: [ 'colorDiffuse', 'colorSpecular', 'specularCoef' ]
        }
      ]
    }
  },

  loadingQueuePrefix: 'architecture',

  controls3d: 'insideWall',

  meshes3d: function (a) {

    //var a = this.attributes

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

  },

  materials3d: function generateMaterials3d (a) {
    return a.materials
  }

}
