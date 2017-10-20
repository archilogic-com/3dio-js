'use strict';

// dependencies

import sortBy from 'lodash/sortBy'
import generateNormals from '../../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../../utils/data3d/buffer/get-uvs'

// helpers

function round (x) {
  return Math.round(x * 1000000) / 1000000
}

// class

export default {

  params: {

    type: 'wall',

    x: 0,
    y: 0,
    z: 0,

    ry: 0,       // rotation angle (deg)

    l: 1,        // length
    w: 0.15,     // width (=thickness)
    h: 2.4,      // height (! use apartment height)

    lock: false,

    bake: true,
    bakeStatus: 'none', // none, pending, done

    materials: {
      front: 'default_plaster_001', //'basic-wall',
      back: 'default_plaster_001', //'basic-wall',
      base: {
        colorDiffuse: [ 0.95, 0.95, 0.95 ]
      },
      top: 'wall_top'
    },

    baseHeight: 0,
    frontHasBase: true,
    backHasBase: true

  },

  valid: {
    children: [ 'door', 'window' ],
    x: {
      step: 0.05
    },
    z: {
      step: 0.05
    },
    ry: {
      //step: 45
      snap: 45
    },
    l: {
      step: 0.05
    }
  },

  initialize: function(){

    // backwards compatibility
    if (this.a.frontMaterial) {
      this.a.materials.front = this.a.frontMaterial
      delete this.a.frontMaterial
    }
    if (this.a.backMaterial) {
      this.a.materials.back = this.a.backMaterial
      delete this.a.backMaterial
    }
    if (this.a.baseMaterial) {
      this.a.materials.base = this.a.baseMaterial
      delete this.a.baseMaterial
    }

  },

  contextMenu: {
    templateId: 'generic',
    templateOptions: {
      title: 'Wall'
    },
    controls: [
      {
        title: 'Height',
        type: 'number',
        param: 'h',
        unit: 'm',
        min: 0.05,
        step: 0.05,
        round: 0.01
      },
      {
        title: 'Length',
        type: 'number',
        param: 'l',
        unit: 'm',
        step: 0.05,
        round: 0.01
      },
      {
        title: 'Width',
        type: 'number',
        param: 'w',
        unit: 'm',
        min: 0.05,
        max: 1,
        step: 0.05,
        round: 0.01
      },
      {
        title: 'Vertical Position',
        type: 'number',
        param: 'y',
        unit: 'm',
        step: 0.1,
        round: 0.01
      },
      {
        title: 'Baseboard on Front',
        type: 'boolean',
        param: 'frontHasBase'
      },
      {
        title: 'Baseboard on Back',
        type: 'boolean',
        param: 'backHasBase'
      },
      {
        title: 'Baseboard Height',
        type: 'number',
        param: 'baseHeight',
        unit: 'm',
        step: 0.05,
        round: 0.01
      },
      {
        title: 'Lock this item',
        type: 'boolean',
        param: 'locked',
        subscriptions: ['pro', 'modeller', 'artist3d']
      },
      {
        display: '<h2>Materials</h2>',
        type: 'html'
      },
      {
        title: 'Front',
        type: 'material',
        param: 'materials.front',
        category: 'wall'
      },
      {
        title: 'Back',
        type: 'material',
        param: 'materials.back',
        category: 'wall'
      },
      {
        title: 'Baseboard',
        type: 'material',
        param: 'materials.base',
        category: 'wall'
      }
    ]
  },

  bindings: [{
    events: [
      'change:h',
      'change:l',
      'change:w',
      'change:baseHeight',
      'change:frontHasBase',
      'change:backHasBase',
      '*/add',
      '*/remove',
      '*/change:x',
      '*/change:y',
      '*/change:z',
      '*/change:ry',
      '*/change:l',
      '*/change:h'
    ],
    call: 'meshes3d'
  },{
    events: [
      'change:materials.*'
    ],
    call: 'materials3d'
  }],

  loadingQueuePrefix: 'architecture',

  controls3d: 'wall',

  meshes3d: function generateMeshes3d() {
    var a = this.a
    // get children
    var children = a.children //.models
    children = sortBy(children, function (model) {
      if (model.a !== undefined) {
        return model.a.x
      } else {
        return model.x
      }
    })

    // geometry
    var baseHeightFront = a.frontHasBase ? a.baseHeight : 0,
      baseHeightBack = a.backHasBase ? a.baseHeight : 0,

      baseVertices = [],
      baseVerticesPointer = 0,
      frontVertices = [],
      frontVerticesPointer = 0,
      frontUvs = [],
      frontUvsPointer = 0,
      backVertices = [],
      backVerticesPointer = 0,
      backUvs = [],
      backUvsPointer = 0,
      topVertices = [],
      topVerticesPointer = 0,

      pointer = 0,

      al = a.l,
      aw = a.w,
      ah = a.h,

      c, cPrev, cNext, cx, cy, cl, cw, ch, _y1, _y2

    for (var i = 0, l = children.length; i < l; i++) {

      c = (children[ i ].a) ? children[ i ].a : children[ i ] // children attributes
      cPrev = children[ i - 1 ] ? children[ i - 1 ].a : null // previous children attributes
      cNext = children[ i + 1 ] ? children[ i + 1 ].a : null // next children attributes

      cx = c.x
      cy = c.y
      cl = c.l
      cw = c.w
      ch = c.h

      // wall before children

      if (pointer < cx) {

        // front quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
        frontVertices[ frontVerticesPointer + 3 ] = cx
        frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 5 ] = aw
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = cx
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = ah
        frontVertices[ frontVerticesPointer + 17 ] = aw
        frontVerticesPointer += 18
        // front quad uvs
        frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
        frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
        frontUvs[ frontUvsPointer + 2 ] = cx
        frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
        frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = cx
        frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
        frontUvs[ frontUvsPointer + 10 ] = pointer
        frontUvs[ frontUvsPointer + 11 ] = ah
        frontUvsPointer += 12

        // front baseboard quad vertices
        if (baseHeightFront) {
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
          baseVertices[ baseVerticesPointer + 3 ] = cx
          baseVertices[ baseVerticesPointer + 4 ] = 0
          baseVertices[ baseVerticesPointer + 5 ] = aw
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = cx
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
          baseVertices[ baseVerticesPointer + 17 ] = aw
          baseVerticesPointer += 18
        }

        // back quad vertices
        backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
        backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = ah
        backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = 0
        backVertices[ backVerticesPointer + 3 ] = cx
        backVertices[ backVerticesPointer + 4 ] = ah
        backVertices[ backVerticesPointer + 5 ] = 0
        backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = cx
        backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = baseHeightBack
        backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = 0
        backVertices[ backVerticesPointer + 15 ] = pointer
        backVertices[ backVerticesPointer + 16 ] = baseHeightBack
        backVertices[ backVerticesPointer + 17 ] = 0
        backVerticesPointer += 18
        // back quad uvs
        backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = pointer
        backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = ah
        backUvs[ backUvsPointer + 2 ] = cx
        backUvs[ backUvsPointer + 3 ] = ah
        backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = cx
        backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = baseHeightBack
        backUvs[ backUvsPointer + 10 ] = pointer
        backUvs[ backUvsPointer + 11 ] = baseHeightBack
        backUvsPointer += 12

        // back baseboard quad vertices
        if (baseHeightBack) {
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = baseHeightBack
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
          baseVertices[ baseVerticesPointer + 3 ] = cx
          baseVertices[ baseVerticesPointer + 4 ] = baseHeightBack
          baseVertices[ baseVerticesPointer + 5 ] = 0
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = cx
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = 0
          baseVertices[ baseVerticesPointer + 17 ] = 0
          baseVerticesPointer += 18
        }

        // top quad vertices
        topVertices[ topVerticesPointer ] = topVertices[ topVerticesPointer + 9 ] = pointer
        topVertices[ topVerticesPointer + 1 ] = topVertices[ topVerticesPointer + 10 ] = ah
        topVertices[ topVerticesPointer + 2 ] = topVertices[ topVerticesPointer + 11 ] = aw
        topVertices[ topVerticesPointer + 3 ] = cx
        topVertices[ topVerticesPointer + 4 ] = ah
        topVertices[ topVerticesPointer + 5 ] = aw
        topVertices[ topVerticesPointer + 6 ] = topVertices[ topVerticesPointer + 12 ] = cx
        topVertices[ topVerticesPointer + 7 ] = topVertices[ topVerticesPointer + 13 ] = ah
        topVertices[ topVerticesPointer + 8 ] = topVertices[ topVerticesPointer + 14 ] = 0
        topVertices[ topVerticesPointer + 15 ] = pointer
        topVertices[ topVerticesPointer + 16 ] = ah
        topVertices[ topVerticesPointer + 17 ] = 0
        topVerticesPointer += 18

        if (pointer === 0) {
          // left side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
          frontVertices[ frontVerticesPointer + 5 ] = aw
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = ah
          frontVertices[ frontVerticesPointer + 17 ] = 0
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
          frontUvs[ frontUvsPointer + 2 ] = aw
          frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
          frontUvs[ frontUvsPointer + 10 ] = 0
          frontUvs[ frontUvsPointer + 11 ] = ah
          frontUvsPointer += 12

          // left side baseboard quad vertrices
          if (baseHeightFront) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = aw
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
            baseVertices[ baseVerticesPointer + 17 ] = 0
            baseVerticesPointer += 18
          }

        }
      }

      // move pointer position
      pointer = cx

      // wall below children
      if (cy > 0) {
        var baseHeightBackBelow = baseHeightBack > c.y ? c.y : baseHeightBack
        var baseHeightFrontBelow = baseHeightFront > c.y ? c.y : baseHeightFront

        if (c.y>baseHeightFront){
          // front quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
          frontVertices[ frontVerticesPointer + 5 ] = aw
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = cy
          frontVertices[ frontVerticesPointer + 17 ] = aw
          frontVerticesPointer += 18
          // front quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
          frontUvs[ frontUvsPointer + 2 ] = pointer + cl
          frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = pointer + cl
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cy
          frontUvs[ frontUvsPointer + 10 ] = pointer
          frontUvs[ frontUvsPointer + 11 ] = cy
          frontUvsPointer += 12
        }

        if (baseHeightFront) {
          // front baseboard quad vertices
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
          baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 4 ] = 0
          baseVertices[ baseVerticesPointer + 5 ] = aw
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFrontBelow
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = baseHeightFrontBelow
          baseVertices[ baseVerticesPointer + 17 ] = aw
          baseVerticesPointer += 18
        }

        if (c.y>baseHeightBack){
          // back quad vertices
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = 0
          backVertices[ backVerticesPointer + 3 ] = pointer + cl
          backVertices[ backVerticesPointer + 4 ] = cy
          backVertices[ backVerticesPointer + 5 ] = 0
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = baseHeightBack
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = 0
          backVertices[ backVerticesPointer + 15 ] = pointer
          backVertices[ backVerticesPointer + 16 ] = baseHeightBack
          backVertices[ backVerticesPointer + 17 ] = 0
          backVerticesPointer += 18
          // back quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = pointer
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = cy
          backUvs[ backUvsPointer + 2 ] = pointer + cl
          backUvs[ backUvsPointer + 3 ] = cy
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = pointer + cl
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = baseHeightBack
          backUvs[ backUvsPointer + 10 ] = pointer
          backUvs[ backUvsPointer + 11 ] = baseHeightBack
          backUvsPointer += 12
        }

        if (baseHeightBack) {
          // back base quad vertices
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = baseHeightBackBelow
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
          baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 4 ] = baseHeightBackBelow
          baseVertices[ baseVerticesPointer + 5 ] = 0
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = 0
          baseVertices[ baseVerticesPointer + 17 ] = 0
          baseVerticesPointer += 18
        }

        // top quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
        frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 4 ] = cy
        frontVertices[ frontVerticesPointer + 5 ] = aw
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = cy
        frontVertices[ frontVerticesPointer + 17 ] = 0
        frontVerticesPointer += 18
        // top quad uvs
        frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
        frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = aw
        frontUvs[ frontUvsPointer + 2 ] = pointer + cl
        frontUvs[ frontUvsPointer + 3 ] = aw
        frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = pointer + cl
        frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = 0
        frontUvs[ frontUvsPointer + 10 ] = pointer
        frontUvs[ frontUvsPointer + 11 ] = 0
        frontUvsPointer += 12

        // left side
        if (pointer <= 0) {
          // left side quad vertices
          if (c.y>baseHeightFront){
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
            frontVertices[ frontVerticesPointer + 3 ] = pointer
            frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 5 ] = aw
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
            frontVertices[ frontVerticesPointer + 15 ] = pointer
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = 0
            frontVerticesPointer += 18
            // left side quad uvs
            frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
            frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
            frontUvs[ frontUvsPointer + 2 ] = aw
            frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
            frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
            frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cy
            frontUvs[ frontUvsPointer + 10 ] = 0
            frontUvs[ frontUvsPointer + 11 ] = cy
            frontUvsPointer += 12
          }
          // left side baseboard quad vertices
          if (baseHeightFront) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = aw
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 17 ] = 0
            baseVerticesPointer += 18
          }
        } else if (cPrev && cx === round(cPrev.x + cPrev.l) && cPrev.y < cy) {
          // adjacent to a window
          _y1 = Math.max(baseHeightFront, cPrev.y)
          // left side quad vertices
          if (c.y>baseHeightFront){
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = _y1
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
            frontVertices[ frontVerticesPointer + 3 ] = pointer
            frontVertices[ frontVerticesPointer + 4 ] = _y1
            frontVertices[ frontVerticesPointer + 5 ] = aw
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
            frontVertices[ frontVerticesPointer + 15 ] = pointer
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = 0
            frontVerticesPointer += 18
            // left side quad uvs
            frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
            frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = _y1
            frontUvs[ frontUvsPointer + 2 ] = aw
            frontUvs[ frontUvsPointer + 3 ] = _y1
            frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
            frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cy
            frontUvs[ frontUvsPointer + 10 ] = 0
            frontUvs[ frontUvsPointer + 11 ] = cy
            frontUvsPointer += 12
          }

          // left side base quad vertices
          if (baseHeightFront && cPrev.y < baseHeightFront) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = aw
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _y1
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = _y1
            baseVertices[ baseVerticesPointer + 17 ] = 0
            baseVerticesPointer += 18
          }
        }

        // right side
        if (round(pointer + cl) >= al) {
          // right side quad vertices
          if (c.y>baseHeightFront){
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
            frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 5 ] = 0
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
            frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = aw
            frontVerticesPointer += 18
            // right side quad uvs
            frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
            frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
            frontUvs[ frontUvsPointer + 2 ] = 0
            frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
            frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
            frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cy
            frontUvs[ frontUvsPointer + 10 ] = aw
            frontUvs[ frontUvsPointer + 11 ] = cy
            frontUvsPointer += 12
          }

          if (baseHeightFront) {
            // right side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = 0
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 17 ] = aw
            baseVerticesPointer += 18
          }
        } else if (cNext && round(cx + cl) === cNext.x && cNext.y < cy) {
          // adjacent to a window
          _y1 = Math.max(baseHeightFront, cNext.y)
          // right side quad vertices
          if (c.y>baseHeightFront){
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
            frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 4 ] = _y1
            frontVertices[ frontVerticesPointer + 5 ] = aw
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = _y1
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
            frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = 0
            frontVerticesPointer += 18
            // right side quad uvs
            frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
            frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy
            frontUvs[ frontUvsPointer + 2 ] = aw
            frontUvs[ frontUvsPointer + 3 ] = _y1
            frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
            frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = _y1
            frontUvs[ frontUvsPointer + 10 ] = 0
            frontUvs[ frontUvsPointer + 11 ] = cy
            frontUvsPointer += 12
          }

          if (baseHeightFront && cNext.y < baseHeightFront) {
            // right side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = _y1
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = aw
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = _y1
            baseVertices[ baseVerticesPointer + 17 ] = 0
            baseVerticesPointer += 18
          }
        }
      }

      // wall left of children
      if (cx > 0) {

        if (!cPrev || cx !== round(cPrev.x + cPrev.l)) {

          _y1 = Math.max(baseHeightFront, cy)
          _y2 = Math.max(baseHeightFront, cy + ch)

          // left side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = _y1
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = _y1
          frontVertices[ frontVerticesPointer + 5 ] = 0
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = _y2
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = _y2
          frontVertices[ frontVerticesPointer + 17 ] = aw
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = _y1
          frontUvs[ frontUvsPointer + 2 ] = 0
          frontUvs[ frontUvsPointer + 3 ] = _y1
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = _y2
          frontUvs[ frontUvsPointer + 10 ] = aw
          frontUvs[ frontUvsPointer + 11 ] = _y2
          frontUvsPointer += 12

          if (baseHeightFront && cy < baseHeightFront) {
            // left side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = 0
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _y1
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = _y1
            baseVertices[ baseVerticesPointer + 17 ] = aw
            baseVerticesPointer += 18

          }
        }
      }

      // wall right of children
      if (cx + cl < al) {

        if (!cNext || round(cx + cl) !== cNext.x) {

          _y1 = Math.max(baseHeightFront, cy)
          _y2 = Math.max(baseHeightFront, cy + ch)

          // right side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = _y1
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = _y1
          frontVertices[ frontVerticesPointer + 5 ] = aw
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = _y2
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
          frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 16 ] = _y2
          frontVertices[ frontVerticesPointer + 17 ] = 0
          frontVerticesPointer += 18
          // right side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = _y1
          frontUvs[ frontUvsPointer + 2 ] = aw
          frontUvs[ frontUvsPointer + 3 ] = _y1
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = _y2
          frontUvs[ frontUvsPointer + 10 ] = 0
          frontUvs[ frontUvsPointer + 11 ] = _y2
          frontUvsPointer += 12

          if (baseHeightFront && cy < baseHeightFront) {
            // right side baseboard quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = aw
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _y1
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = _y1
            baseVertices[ baseVerticesPointer + 17 ] = 0
            baseVerticesPointer += 18
          }
        }

      }

      // wall above children
      if (round(cy + ch) < ah) {

        // front quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
        frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 4 ] = cy + ch
        frontVertices[ frontVerticesPointer + 5 ] = aw
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = ah
        frontVertices[ frontVerticesPointer + 17 ] = aw
        frontVerticesPointer += 18
        // front quad uvs
        frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
        frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy + ch
        frontUvs[ frontUvsPointer + 2 ] = pointer + cl
        frontUvs[ frontUvsPointer + 3 ] = cy + ch
        frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = pointer + cl
        frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
        frontUvs[ frontUvsPointer + 10 ] = pointer
        frontUvs[ frontUvsPointer + 11 ] = ah
        frontUvsPointer += 12

        // back quad vertices
        backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
        backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = ah
        backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = 0
        backVertices[ backVerticesPointer + 3 ] = pointer + cl
        backVertices[ backVerticesPointer + 4 ] = ah
        backVertices[ backVerticesPointer + 5 ] = 0
        backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
        backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy + ch
        backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = 0
        backVertices[ backVerticesPointer + 15 ] = pointer
        backVertices[ backVerticesPointer + 16 ] = cy + ch
        backVertices[ backVerticesPointer + 17 ] = 0
        backVerticesPointer += 18
        // back quad uvs
        backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = pointer
        backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = ah
        backUvs[ backUvsPointer + 2 ] = pointer + cl
        backUvs[ backUvsPointer + 3 ] = ah
        backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = pointer + cl
        backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = cy + ch
        backUvs[ backUvsPointer + 10 ] = pointer
        backUvs[ backUvsPointer + 11 ] = cy + ch
        backUvsPointer += 12

        // top quad vertices
        topVertices[ topVerticesPointer ] = topVertices[ topVerticesPointer + 9 ] = pointer
        topVertices[ topVerticesPointer + 1 ] = topVertices[ topVerticesPointer + 10 ] = ah
        topVertices[ topVerticesPointer + 2 ] = topVertices[ topVerticesPointer + 11 ] = aw
        topVertices[ topVerticesPointer + 3 ] = pointer + cl
        topVertices[ topVerticesPointer + 4 ] = ah
        topVertices[ topVerticesPointer + 5 ] = aw
        topVertices[ topVerticesPointer + 6 ] = topVertices[ topVerticesPointer + 12 ] = pointer + cl
        topVertices[ topVerticesPointer + 7 ] = topVertices[ topVerticesPointer + 13 ] = ah
        topVertices[ topVerticesPointer + 8 ] = topVertices[ topVerticesPointer + 14 ] = 0
        topVertices[ topVerticesPointer + 15 ] = pointer
        topVertices[ topVerticesPointer + 16 ] = ah
        topVertices[ topVerticesPointer + 17 ] = 0
        topVerticesPointer += 18

        // below quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
        frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 4 ] = cy + ch
        frontVertices[ frontVerticesPointer + 5 ] = 0
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy + ch
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = cy + ch
        frontVertices[ frontVerticesPointer + 17 ] = aw
        frontVerticesPointer += 18
        // below quad uvs
        frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
        frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = 0
        frontUvs[ frontUvsPointer + 2 ] = pointer + cl
        frontUvs[ frontUvsPointer + 3 ] = 0
        frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = pointer + cl
        frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = aw
        frontUvs[ frontUvsPointer + 10 ] = pointer
        frontUvs[ frontUvsPointer + 11 ] = aw
        frontUvsPointer += 12

        if (pointer <= 0) {

          // left side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = aw
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = ah
          frontVertices[ frontVerticesPointer + 17 ] = 0
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy + ch
          frontUvs[ frontUvsPointer + 2 ] = aw
          frontUvs[ frontUvsPointer + 3 ] = cy + ch
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cy
          frontUvs[ frontUvsPointer + 10 ] = 0
          frontUvs[ frontUvsPointer + 11 ] = ah
          frontUvsPointer += 12

        } else if (cPrev && cx === round(cPrev.x + cPrev.l) && round(cPrev.y + cPrev.h) > round(cy + ch)) {

          // adjacent windows

          // left side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = aw
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cPrev.y + cPrev.h
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = cPrev.y + cPrev.h
          frontVertices[ frontVerticesPointer + 17 ] = 0
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy + ch
          frontUvs[ frontUvsPointer + 2 ] = aw
          frontUvs[ frontUvsPointer + 3 ] = cy + ch
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cPrev.y + cPrev.h
          frontUvs[ frontUvsPointer + 10 ] = 0
          frontUvs[ frontUvsPointer + 11 ] = cPrev.y + cPrev.h
          frontUvsPointer += 12
        }

        if (round(pointer + cl) >= al) {

          // right side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = 0
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
          frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 16 ] = ah
          frontVertices[ frontVerticesPointer + 17 ] = aw
          frontVerticesPointer += 18
          // right side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy + ch
          frontUvs[ frontUvsPointer + 2 ] = 0
          frontUvs[ frontUvsPointer + 3 ] = cy + ch
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
          frontUvs[ frontUvsPointer + 10 ] = aw
          frontUvs[ frontUvsPointer + 11 ] = ah
          frontUvsPointer += 12

        } else if (cNext && round(cx + cl) === cNext.x && round(cNext.y + cNext.h) > round(cy + ch)) {

          // adjacent windows
          // right side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = 0
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cNext.y + cNext.h
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
          frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 16 ] = cNext.y + cNext.h
          frontVertices[ frontVerticesPointer + 17 ] = aw
          frontVerticesPointer += 18
          // right side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy + ch
          frontUvs[ frontUvsPointer + 2 ] = 0
          frontUvs[ frontUvsPointer + 3 ] = cy + ch
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cNext.y + cNext.h
          frontUvs[ frontUvsPointer + 10 ] = aw
          frontUvs[ frontUvsPointer + 11 ] = cNext.y + cNext.h
          frontUvsPointer += 12

        }
      }

      pointer += cl // set new pointer position

    }

    // wall after last children ( or the only wall if there is no children )
    if (pointer < al) {

      // front quad vertices
      frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
      frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
      frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
      frontVertices[ frontVerticesPointer + 3 ] = al
      frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
      frontVertices[ frontVerticesPointer + 5 ] = aw
      frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = al
      frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
      frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
      frontVertices[ frontVerticesPointer + 15 ] = pointer
      frontVertices[ frontVerticesPointer + 16 ] = ah
      frontVertices[ frontVerticesPointer + 17 ] = aw
      frontVerticesPointer += 18
      // front quad uvs
      frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
      frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
      frontUvs[ frontUvsPointer + 2 ] = al
      frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
      frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = al
      frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
      frontUvs[ frontUvsPointer + 10 ] = pointer
      frontUvs[ frontUvsPointer + 11 ] = ah
      frontUvsPointer += 12

      if (baseHeightFront) {
        // front baseboard vertices
        baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
        baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
        baseVertices[ baseVerticesPointer + 3 ] = al
        baseVertices[ baseVerticesPointer + 4 ] = 0
        baseVertices[ baseVerticesPointer + 5 ] = aw
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
        baseVertices[ baseVerticesPointer + 15 ] = pointer
        baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 17 ] = aw
        baseVerticesPointer += 18
      }

      // back quad vertices
      backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
      backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = ah
      backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = 0
      backVertices[ backVerticesPointer + 3 ] = al
      backVertices[ backVerticesPointer + 4 ] = ah
      backVertices[ backVerticesPointer + 5 ] = 0
      backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = al
      backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = baseHeightBack
      backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = 0
      backVertices[ backVerticesPointer + 15 ] = pointer
      backVertices[ backVerticesPointer + 16 ] = baseHeightBack
      backVertices[ backVerticesPointer + 17 ] = 0
      backVerticesPointer += 18
      // back quad uvs
      backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = pointer
      backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = ah
      backUvs[ backUvsPointer + 2 ] = al
      backUvs[ backUvsPointer + 3 ] = ah
      backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = al
      backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = baseHeightBack
      backUvs[ backUvsPointer + 10 ] = pointer
      backUvs[ backUvsPointer + 11 ] = baseHeightBack
      backUvsPointer += 12

      if (baseHeightBack) {
        // back baseboard vertices
        baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
        baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = baseHeightBack
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
        baseVertices[ baseVerticesPointer + 3 ] = al
        baseVertices[ baseVerticesPointer + 4 ] = baseHeightBack
        baseVertices[ baseVerticesPointer + 5 ] = 0
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
        baseVertices[ baseVerticesPointer + 15 ] = pointer
        baseVertices[ baseVerticesPointer + 16 ] = 0
        baseVertices[ baseVerticesPointer + 17 ] = 0
        baseVerticesPointer += 18
      }

      // top quad vertices
      topVertices[ topVerticesPointer ] = topVertices[ topVerticesPointer + 9 ] = pointer
      topVertices[ topVerticesPointer + 1 ] = topVertices[ topVerticesPointer + 10 ] = ah
      topVertices[ topVerticesPointer + 2 ] = topVertices[ topVerticesPointer + 11 ] = aw
      topVertices[ topVerticesPointer + 3 ] = al
      topVertices[ topVerticesPointer + 4 ] = ah
      topVertices[ topVerticesPointer + 5 ] = aw
      topVertices[ topVerticesPointer + 6 ] = topVertices[ topVerticesPointer + 12 ] = al
      topVertices[ topVerticesPointer + 7 ] = topVertices[ topVerticesPointer + 13 ] = ah
      topVertices[ topVerticesPointer + 8 ] = topVertices[ topVerticesPointer + 14 ] = 0
      topVertices[ topVerticesPointer + 15 ] = pointer
      topVertices[ topVerticesPointer + 16 ] = ah
      topVertices[ topVerticesPointer + 17 ] = 0
      topVerticesPointer += 18

      // front quad vertices
      frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
      frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = 0
      frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
      frontVertices[ frontVerticesPointer + 3 ] = al
      frontVertices[ frontVerticesPointer + 4 ] = 0
      frontVertices[ frontVerticesPointer + 5 ] = 0
      frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = al
      frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = 0
      frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
      frontVertices[ frontVerticesPointer + 15 ] = pointer
      frontVertices[ frontVerticesPointer + 16 ] = 0
      frontVertices[ frontVerticesPointer + 17 ] = aw
      frontVerticesPointer += 18
      // front quad uvs
      frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = pointer
      frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = 0
      frontUvs[ frontUvsPointer + 2 ] = al
      frontUvs[ frontUvsPointer + 3 ] = 0
      frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = al
      frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = 0
      frontUvs[ frontUvsPointer + 10 ] = pointer
      frontUvs[ frontUvsPointer + 11 ] = 0
      frontUvsPointer += 12

      if (pointer === 0) {
        // left side quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
        frontVertices[ frontVerticesPointer + 3 ] = pointer
        frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 5 ] = aw
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = aw
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = ah
        frontVertices[ frontVerticesPointer + 17 ] = 0
        frontVerticesPointer += 18
        // left side quad uvs
        frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
        frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
        frontUvs[ frontUvsPointer + 2 ] = aw
        frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
        frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
        frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
        frontUvs[ frontUvsPointer + 10 ] = 0
        frontUvs[ frontUvsPointer + 11 ] = ah
        frontUvsPointer += 12

        if (baseHeightFront) {
          // left side baseboard quad vertices
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
          baseVertices[ baseVerticesPointer + 3 ] = pointer
          baseVertices[ baseVerticesPointer + 4 ] = 0
          baseVertices[ baseVerticesPointer + 5 ] = aw
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = aw
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
          baseVertices[ baseVerticesPointer + 17 ] = 0
          baseVerticesPointer += 18
        }
      }

      // right side quad vertices
      frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = al
      frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
      frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = aw
      frontVertices[ frontVerticesPointer + 3 ] = al
      frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
      frontVertices[ frontVerticesPointer + 5 ] = 0
      frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = al
      frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
      frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = 0
      frontVertices[ frontVerticesPointer + 15 ] = al
      frontVertices[ frontVerticesPointer + 16 ] = ah
      frontVertices[ frontVerticesPointer + 17 ] = aw
      frontVerticesPointer += 18
      // right side quad uvs
      frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
      frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
      frontUvs[ frontUvsPointer + 2 ] = 0
      frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
      frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
      frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
      frontUvs[ frontUvsPointer + 10 ] = aw
      frontUvs[ frontUvsPointer + 11 ] = ah
      frontUvsPointer += 12

      if (baseHeightFront) {
        // right side baseboard quad
        baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = al
        baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = aw
        baseVertices[ baseVerticesPointer + 3 ] = al
        baseVertices[ baseVerticesPointer + 4 ] = 0
        baseVertices[ baseVerticesPointer + 5 ] = 0
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
        baseVertices[ baseVerticesPointer + 15 ] = al
        baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 17 ] = aw
        baseVerticesPointer += 18
      }
    }

    return {
      front: {
        positions: new Float32Array(frontVertices),
        normals: generateNormals.flat(frontVertices),
        uvs: new Float32Array(frontUvs),
        material: 'front'
      },
      back: {
        positions: new Float32Array(backVertices),
        normals: generateNormals.flat(backVertices),
        uvs: new Float32Array(backUvs),
        material: 'back'
      },
      top: {
        positions: new Float32Array(topVertices),
        normals: generateNormals.flat(topVertices),
        material: 'top'
      },
      base: {
        positions: new Float32Array(baseVertices),
        normals: generateNormals.flat(baseVertices),
        uvs: generateUvs.architectural(baseVertices),
        material: 'base'
      }
    }

  },

  materials3d: function generateMaterials3d() {
    return this.a.materials
  }

}