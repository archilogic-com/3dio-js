'use strict';

import generatePolygonBuffer from '../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../utils/data3d/buffer/get-uvs'
import getMaterials3d from './common/get-materials'

import sortBy from 'lodash/sortBy'
import loadData3d from '../../../utils/data3d/load'

export default function getData3d(attributes) {
  return Promise.all([
    generateMeshes3d(attributes),
    attributes.materials ? getMaterials3d(attributes.materials): []
  ]).then(results => ({
    meshes: results[0],
    materials: results[1]
  }))
}

function generateMeshes3d(a) {

  // get children
  var children = a.children
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
    // walls are drawn along their controlLine
    controlLine = a.controlLine ? a.controlLine : 'back',

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
    // wall width
    aw = a.w,
    // back position
    azb = controlLine === 'front' ? -aw : controlLine === 'center' ? -aw / 2 : 0,
    // front position
    azf = azb + aw,
    ah = a.h,

    c, cPrev, cNext, cx, cy, cz, cl, cw, ch, _y1, _y2, _yf, _yb

  for (var i = 0, l = children.length; i < l; i++) {

    c = (children[ i ].a) ? children[ i ].a : children[ i ] // children attributes
    cPrev = children[ i - 1 ] ? children[ i - 1 ].a : null // previous children attributes
    cNext = children[ i + 1 ] ? children[ i + 1 ].a : null // next children attributes

    cx = c.x
    cy = c.y
    cl = c.l
    cw = c.w
    ch = c.h
    cz = c.side === 'front' ? azf : c.side === 'center' ? azb + aw / 2 : azb

    // wall before children

    if (pointer < cx) {

      // front quad vertices
      frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
      frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
      frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
      frontVertices[ frontVerticesPointer + 3 ] = cx
      frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
      frontVertices[ frontVerticesPointer + 5 ] = azf
      frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = cx
      frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
      frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
      frontVertices[ frontVerticesPointer + 15 ] = pointer
      frontVertices[ frontVerticesPointer + 16 ] = ah
      frontVertices[ frontVerticesPointer + 17 ] = azf
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
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
        baseVertices[ baseVerticesPointer + 3 ] = cx
        baseVertices[ baseVerticesPointer + 4 ] = 0
        baseVertices[ baseVerticesPointer + 5 ] = azf
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = cx
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
        baseVertices[ baseVerticesPointer + 15 ] = pointer
        baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 17 ] = azf
        baseVerticesPointer += 18
      }

      // back quad vertices
      backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
      backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = ah
      backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
      backVertices[ backVerticesPointer + 3 ] = cx
      backVertices[ backVerticesPointer + 4 ] = ah
      backVertices[ backVerticesPointer + 5 ] = azb
      backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = cx
      backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = baseHeightBack
      backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
      backVertices[ backVerticesPointer + 15 ] = pointer
      backVertices[ backVerticesPointer + 16 ] = baseHeightBack
      backVertices[ backVerticesPointer + 17 ] = azb
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
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
        baseVertices[ baseVerticesPointer + 3 ] = cx
        baseVertices[ baseVerticesPointer + 4 ] = baseHeightBack
        baseVertices[ baseVerticesPointer + 5 ] = azb
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = cx
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
        baseVertices[ baseVerticesPointer + 15 ] = pointer
        baseVertices[ baseVerticesPointer + 16 ] = 0
        baseVertices[ baseVerticesPointer + 17 ] = azb
        baseVerticesPointer += 18
      }

      // top quad vertices
      topVertices[ topVerticesPointer ] = topVertices[ topVerticesPointer + 9 ] = pointer
      topVertices[ topVerticesPointer + 1 ] = topVertices[ topVerticesPointer + 10 ] = ah
      topVertices[ topVerticesPointer + 2 ] = topVertices[ topVerticesPointer + 11 ] = azf
      topVertices[ topVerticesPointer + 3 ] = cx
      topVertices[ topVerticesPointer + 4 ] = ah
      topVertices[ topVerticesPointer + 5 ] = azf
      topVertices[ topVerticesPointer + 6 ] = topVertices[ topVerticesPointer + 12 ] = cx
      topVertices[ topVerticesPointer + 7 ] = topVertices[ topVerticesPointer + 13 ] = ah
      topVertices[ topVerticesPointer + 8 ] = topVertices[ topVerticesPointer + 14 ] = azb
      topVertices[ topVerticesPointer + 15 ] = pointer
      topVertices[ topVerticesPointer + 16 ] = ah
      topVertices[ topVerticesPointer + 17 ] = azb
      topVerticesPointer += 18

      if (pointer === 0) {
        // start face of the wall if there are openings in the wall
        // react to wall controlLine position
        if (azf > 0) {
          // left side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
          frontVertices[ frontVerticesPointer + 5 ] = azf
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = ah
          frontVertices[ frontVerticesPointer + 17 ] = 0
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
          frontUvs[ frontUvsPointer + 2 ] = azf
          frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = azf
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
            baseVertices[ baseVerticesPointer + 5 ] = azf
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
            baseVertices[ baseVerticesPointer + 17 ] = 0
            baseVerticesPointer += 18
          }
        }
        if (azb < 0) {
          // left side quad vertices
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = baseHeightBack
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
          backVertices[ backVerticesPointer + 3 ] = pointer
          backVertices[ backVerticesPointer + 4 ] = baseHeightBack
          backVertices[ backVerticesPointer + 5 ] = 0
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = ah
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = 0
          backVertices[ backVerticesPointer + 15 ] = pointer
          backVertices[ backVerticesPointer + 16 ] = ah
          backVertices[ backVerticesPointer + 17 ] = azb
          backVerticesPointer += 18
          // left side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = baseHeightBack
          backUvs[ backUvsPointer + 2 ] = azb
          backUvs[ backUvsPointer + 3 ] = baseHeightBack
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = azb
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = ah
          backUvs[ backUvsPointer + 10 ] = 0
          backUvs[ backUvsPointer + 11 ] = ah
          backUvsPointer += 12

          // left side baseboard quad vertrices
          if (baseHeightBack) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = 0
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightBack
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightBack
            baseVertices[ baseVerticesPointer + 17 ] = azb
            baseVerticesPointer += 18
          }
        }
      }
    }

    // move pointer position
    pointer = cx

    // wall below children
    if (cy > 0) {
      var baseHeightBackBelow = baseHeightBack > c.y ? c.y : baseHeightBack
      var baseHeightFrontBelow = baseHeightFront > c.y ? c.y : baseHeightFront

      if (c.y > baseHeightFront){
        // front quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
        frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 5 ] = azf
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = cy
        frontVertices[ frontVerticesPointer + 17 ] = azf
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
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
        baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
        baseVertices[ baseVerticesPointer + 4 ] = 0
        baseVertices[ baseVerticesPointer + 5 ] = azf
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFrontBelow
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
        baseVertices[ baseVerticesPointer + 15 ] = pointer
        baseVertices[ baseVerticesPointer + 16 ] = baseHeightFrontBelow
        baseVertices[ baseVerticesPointer + 17 ] = azf
        baseVerticesPointer += 18
      }

      if (c.y>baseHeightBack){
        // back quad vertices
        backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
        backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy
        backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
        backVertices[ backVerticesPointer + 3 ] = pointer + cl
        backVertices[ backVerticesPointer + 4 ] = cy
        backVertices[ backVerticesPointer + 5 ] = azb
        backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
        backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = baseHeightBack
        backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
        backVertices[ backVerticesPointer + 15 ] = pointer
        backVertices[ backVerticesPointer + 16 ] = baseHeightBack
        backVertices[ backVerticesPointer + 17 ] = azb
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
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
        baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
        baseVertices[ baseVerticesPointer + 4 ] = baseHeightBackBelow
        baseVertices[ baseVerticesPointer + 5 ] = azb
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
        baseVertices[ baseVerticesPointer + 15 ] = pointer
        baseVertices[ baseVerticesPointer + 16 ] = 0
        baseVertices[ baseVerticesPointer + 17 ] = azb
        baseVerticesPointer += 18
      }

      // top quad vertices below opening
      // react to opening z-position
      if (azf > cz) {
        if (c.y > baseHeightFront) {
          // baseboard lower than opening
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = cy
          frontVertices[ frontVerticesPointer + 5 ] = azf
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = cz
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = cy
          frontVertices[ frontVerticesPointer + 17 ] = cz
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
        } else {
          // draw baseboard
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cy
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
          baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 4 ] = cy
          baseVertices[ baseVerticesPointer + 5 ] = azf
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = cy
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = cy
          baseVertices[ baseVerticesPointer + 17 ] = cz
          baseVerticesPointer += 18
        }

      }
      if (cz > azb) {
        if (c.y > baseHeightBack) {
          // baseboard lower than opening
          // top quad vertices
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = cz
          backVertices[ backVerticesPointer + 3 ] = pointer + cl
          backVertices[ backVerticesPointer + 4 ] = cy
          backVertices[ backVerticesPointer + 5 ] = cz
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
          backVertices[ backVerticesPointer + 15 ] = pointer
          backVertices[ backVerticesPointer + 16 ] = cy
          backVertices[ backVerticesPointer + 17 ] = azb
          backVerticesPointer += 18
          // top quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = pointer
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = aw
          backUvs[ backUvsPointer + 2 ] = pointer + cl
          backUvs[ backUvsPointer + 3 ] = aw
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = pointer + cl
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = 0
          backUvs[ backUvsPointer + 10 ] = pointer
          backUvs[ backUvsPointer + 11 ] = 0
          backUvsPointer += 12
        } else {
          // draw baseboard
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cy
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
          baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 4 ] = cy
          baseVertices[ baseVerticesPointer + 5 ] = cz
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = cy
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = cy
          baseVertices[ baseVerticesPointer + 17 ] = azb
          baseVerticesPointer += 18
        }
      }
      // left side below opening
      if (pointer <= 0) {
        // start face of the wall if opening is at x = 0
        // left side quad vertices below opening
        // react to opening z-position
        if (azf > cz) {
          if (c.y > baseHeightFront) {
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = cz
            frontVertices[ frontVerticesPointer + 3 ] = pointer
            frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 5 ] = azf
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
            frontVertices[ frontVerticesPointer + 15 ] = pointer
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = cz
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
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = azf
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 17 ] = cz
            baseVerticesPointer += 18
          }
        }
        if (cz > azb) {
          if (c.y > baseHeightBack) {
            backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
            backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = baseHeightBack
            backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
            backVertices[ backVerticesPointer + 3 ] = pointer
            backVertices[ backVerticesPointer + 4 ] = baseHeightBack
            backVertices[ backVerticesPointer + 5 ] = cz
            backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
            backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy
            backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = cz
            backVertices[ backVerticesPointer + 15 ] = pointer
            backVertices[ backVerticesPointer + 16 ] = cy
            backVertices[ backVerticesPointer + 17 ] = azb
            backVerticesPointer += 18
            // left side quad uvs
            backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
            backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = baseHeightBack
            backUvs[ backUvsPointer + 2 ] = aw
            backUvs[ backUvsPointer + 3 ] = baseHeightBack
            backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = aw
            backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = cy
            backUvs[ backUvsPointer + 10 ] = 0
            backUvs[ backUvsPointer + 11 ] = cy
            backUvsPointer += 12
          }
          // left side baseboard quad vertices
          if (baseHeightBack) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = cz
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightBackBelow
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightBackBelow
            baseVertices[ baseVerticesPointer + 17 ] = azb
            baseVerticesPointer += 18
          }
        }
      } else if (cPrev && cx === round(cPrev.x + cPrev.l) && cPrev.y < cy) {
        // adjacent to a window
        _yf = cy > baseHeightFront ? baseHeightFront : cy
        _yb = cy > baseHeightBack ? baseHeightBack : cy
        // left side quad vertices
        // if previous opening is higher
        if (azf > cz) {
          // react to opening z-position
          if (c.y > baseHeightFront) {
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = _yf
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = cz
            frontVertices[ frontVerticesPointer + 3 ] = pointer
            frontVertices[ frontVerticesPointer + 4 ] = _yf
            frontVertices[ frontVerticesPointer + 5 ] = azf
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
            frontVertices[ frontVerticesPointer + 15 ] = pointer
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = cz
            frontVerticesPointer += 18
            // left side quad uvs
            frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
            frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = _yf
            frontUvs[ frontUvsPointer + 2 ] = aw
            frontUvs[ frontUvsPointer + 3 ] = _yf
            frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
            frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = cy
            frontUvs[ frontUvsPointer + 10 ] = 0
            frontUvs[ frontUvsPointer + 11 ] = cy
            frontUvsPointer += 12
          }
          // left side base quad vertices
          if (baseHeightFront && cPrev.y < baseHeightFront) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cPrev.y
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = cPrev.y
            baseVertices[ baseVerticesPointer + 5 ] = azf
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _yf
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = _yf
            baseVertices[ baseVerticesPointer + 17 ] = cz
            baseVerticesPointer += 18
          }
        }
        if (cz > azb) {
          if ( c.y > baseHeightBack) {
            backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
            backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = _yb
            backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
            backVertices[ backVerticesPointer + 3 ] = pointer
            backVertices[ backVerticesPointer + 4 ] = _yb
            backVertices[ backVerticesPointer + 5 ] = cz
            backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
            backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy
            backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = cz
            backVertices[ backVerticesPointer + 15 ] = pointer
            backVertices[ backVerticesPointer + 16 ] = cy
            backVertices[ backVerticesPointer + 17 ] = azb
            backVerticesPointer += 18
            // left side quad uvs
            backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
            backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = _yb
            backUvs[ backUvsPointer + 2 ] = aw
            backUvs[ backUvsPointer + 3 ] = _yb
            backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = aw
            backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = cy
            backUvs[ backUvsPointer + 10 ] = 0
            backUvs[ backUvsPointer + 11 ] = cy
            backUvsPointer += 12
          }
          // left side base quad vertices
          if (baseHeightBack && cPrev.y < baseHeightBack) {
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cPrev.y
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = cPrev.y
            baseVertices[ baseVerticesPointer + 5 ] = cz
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _yb
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = _yb
            baseVertices[ baseVerticesPointer + 17 ] = azb
            baseVerticesPointer += 18
          }
        }
      }

      // right side below opening
      // end face of the wall if opening hits end of wall
      if (round(pointer + cl) >= al) {
        // right side quad vertices
        if (azf > cz) {
          if (c.y > baseHeightFront) {
            // react to opening z-position
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
            frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
            frontVertices[ frontVerticesPointer + 5 ] = cz
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = cz
            frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = azf
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
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = cz
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightFrontBelow
            baseVertices[ baseVerticesPointer + 17 ] = azf
            baseVerticesPointer += 18
          }
        }

        if (cz > azb) {
          if (c.y > baseHeightBack) {
            backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer + cl
            backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = baseHeightBack
            backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = cz
            backVertices[ backVerticesPointer + 3 ] = pointer + cl
            backVertices[ backVerticesPointer + 4 ] = baseHeightBack
            backVertices[ backVerticesPointer + 5 ] = azb
            backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
            backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy
            backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
            backVertices[ backVerticesPointer + 15 ] = pointer + cl
            backVertices[ backVerticesPointer + 16 ] = cy
            backVertices[ backVerticesPointer + 17 ] = cz
            backVerticesPointer += 18
            // right side quad uvs
            backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = aw
            backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = baseHeightBack
            backUvs[ backUvsPointer + 2 ] = 0
            backUvs[ backUvsPointer + 3 ] = baseHeightBack
            backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = 0
            backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = cy
            backUvs[ backUvsPointer + 10 ] = aw
            backUvs[ backUvsPointer + 11 ] = cy
            backUvsPointer += 12
          }
          if (baseHeightBack) {
            // right side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = 0
            baseVertices[ baseVerticesPointer + 5 ] = azb
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightBackBelow
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = baseHeightBackBelow
            baseVertices[ baseVerticesPointer + 17 ] = cz
            baseVerticesPointer += 18
          }
        }
      } else if (cNext && round(cx + cl) === cNext.x && cNext.y < cy) {
        // adjacent to a window
        // right side quad vertices
        // if next window is higher
        _yf = cy > baseHeightFront ? baseHeightFront : cy
        _yb = cy > baseHeightBack ? baseHeightBack : cy
        // react to opening z-position
        if (azf > cz) {
          if (c.y > baseHeightFront) {
            frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy
            frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
            frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 4 ] = _yf
            frontVertices[ frontVerticesPointer + 5 ] = azf
            frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = _yf
            frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = cz
            frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
            frontVertices[ frontVerticesPointer + 16 ] = cy
            frontVertices[ frontVerticesPointer + 17 ] = cz
            frontVerticesPointer += 18
            // right side quad uvs
            frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
            frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy
            frontUvs[ frontUvsPointer + 2 ] = aw
            frontUvs[ frontUvsPointer + 3 ] = _yf
            frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
            frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = _yf
            frontUvs[ frontUvsPointer + 10 ] = 0
            frontUvs[ frontUvsPointer + 11 ] = cy
            frontUvsPointer += 12
          }
          // add baseboard
          if (baseHeightFront && cNext.y < baseHeightFront) {
            // right side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = _yf
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = cNext.y
            baseVertices[ baseVerticesPointer + 5 ] = azf
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = cNext.y
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = _yf
            baseVertices[ baseVerticesPointer + 17 ] = cz
            baseVerticesPointer += 18
          }
        }
        if (cz > azb) {
          if (c.y > baseHeightBack) {
            backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer + cl
            backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy
            backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = cz
            backVertices[ backVerticesPointer + 3 ] = pointer + cl
            backVertices[ backVerticesPointer + 4 ] = _yb
            backVertices[ backVerticesPointer + 5 ] = cz
            backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
            backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = _yb
            backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
            backVertices[ backVerticesPointer + 15 ] = pointer + cl
            backVertices[ backVerticesPointer + 16 ] = cy
            backVertices[ backVerticesPointer + 17 ] = azb
            backVerticesPointer += 18
            // right side quad uvs
            backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = aw
            backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = cy
            backUvs[ backUvsPointer + 2 ] = aw
            backUvs[ backUvsPointer + 3 ] = _yb
            backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = 0
            backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = _yb
            backUvs[ backUvsPointer + 10 ] = 0
            backUvs[ backUvsPointer + 11 ] = cy
            backUvsPointer += 12
          }
          // add baseboard
          if (baseHeightBack && cNext.y < baseHeightBack) {
            // right side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = _yb
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = cNext.y
            baseVertices[ baseVerticesPointer + 5 ] = cz
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = cNext.y
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = _yb
            baseVertices[ baseVerticesPointer + 17 ] = azb
            baseVerticesPointer += 18
          }
        }
      }
    }

    // wall left of children
    if (cx > 0) {

      if (!cPrev || cx !== round(cPrev.x + cPrev.l)) {

        _yf = Math.max(baseHeightFront, cy)
        _yb = Math.max(baseHeightBack, cy)
        _y2 = Math.max(baseHeightFront || baseHeightBack, cy + ch)
        // react to opening z-position
        // left side quad vertices
        if (azf > cz) {
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = _yf
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = _yf
          frontVertices[ frontVerticesPointer + 5 ] = cz
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = _y2
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = cz
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = _y2
          frontVertices[ frontVerticesPointer + 17 ] = azf
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = aw
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = _yf
          frontUvs[ frontUvsPointer + 2 ] = 0
          frontUvs[ frontUvsPointer + 3 ] = _yf
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = 0
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = _y2
          frontUvs[ frontUvsPointer + 10 ] = aw
          frontUvs[ frontUvsPointer + 11 ] = _y2
          frontUvsPointer += 12

          if (baseHeightFront && cy < baseHeightFront) {
            // left side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cy
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = cy
            baseVertices[ baseVerticesPointer + 5 ] = cz
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _yf
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = _yf
            baseVertices[ baseVerticesPointer + 17 ] = azf
            baseVerticesPointer += 18
          }
        }
        if (cz > azb) {
          // left side quad vertices
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = _yb
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = cz
          backVertices[ backVerticesPointer + 3 ] = pointer
          backVertices[ backVerticesPointer + 4 ] = _yb
          backVertices[ backVerticesPointer + 5 ] = azb
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = _y2
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
          backVertices[ backVerticesPointer + 15 ] = pointer
          backVertices[ backVerticesPointer + 16 ] = _y2
          backVertices[ backVerticesPointer + 17 ] = cz
          backVerticesPointer += 18
          // left side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = aw
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = _yb
          backUvs[ backUvsPointer + 2 ] = 0
          backUvs[ backUvsPointer + 3 ] = _yb
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = 0
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = _y2
          backUvs[ backUvsPointer + 10 ] = aw
          backUvs[ backUvsPointer + 11 ] = _y2
          backUvsPointer += 12

          if (baseHeightBack && cy < baseHeightBack) {
            // left side base quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cy
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
            baseVertices[ baseVerticesPointer + 3 ] = pointer
            baseVertices[ baseVerticesPointer + 4 ] = cy
            baseVertices[ baseVerticesPointer + 5 ] = azb
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _yb
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
            baseVertices[ baseVerticesPointer + 15 ] = pointer
            baseVertices[ baseVerticesPointer + 16 ] = _yb
            baseVertices[ baseVerticesPointer + 17 ] = cz
            baseVerticesPointer += 18
          }
        }
      }
    }

    // wall right of children
    if (cx + cl < al) {

      if (!cNext || round(cx + cl) !== cNext.x) {

        _yf = Math.max(baseHeightFront, cy)
        _yb = Math.max(baseHeightBack, cy)
        _y2 = Math.max(baseHeightFront || baseHeightBack, cy + ch)
        // react to opening z-position
        if (azf > cz) {
          // right side quad vertices
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = _yf
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = cz
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = _yf
          frontVertices[ frontVerticesPointer + 5 ] = azf
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = _y2
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
          frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 16 ] = _y2
          frontVertices[ frontVerticesPointer + 17 ] = cz
          frontVerticesPointer += 18
          // right side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = _yf
          frontUvs[ frontUvsPointer + 2 ] = aw
          frontUvs[ frontUvsPointer + 3 ] = _yf
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = _y2
          frontUvs[ frontUvsPointer + 10 ] = 0
          frontUvs[ frontUvsPointer + 11 ] = _y2
          frontUvsPointer += 12

          if (baseHeightFront && cy < baseHeightFront) {
            // right side baseboard quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cy
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = cz
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = cy
            baseVertices[ baseVerticesPointer + 5 ] = azf
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _yf
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = _yf
            baseVertices[ baseVerticesPointer + 17 ] = cz
            baseVerticesPointer += 18
          }
        }
        if (cz > azb) {
          // right side quad vertices
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer + cl
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = _yb
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
          backVertices[ backVerticesPointer + 3 ] = pointer + cl
          backVertices[ backVerticesPointer + 4 ] = _yb
          backVertices[ backVerticesPointer + 5 ] = cz
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = _y2
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = cz
          backVertices[ backVerticesPointer + 15 ] = pointer + cl
          backVertices[ backVerticesPointer + 16 ] = _y2
          backVertices[ backVerticesPointer + 17 ] = azb
          backVerticesPointer += 18
          // right side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = _yb
          backUvs[ backUvsPointer + 2 ] = aw
          backUvs[ backUvsPointer + 3 ] = _yb
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = aw
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = _y2
          backUvs[ backUvsPointer + 10 ] = 0
          backUvs[ backUvsPointer + 11 ] = _y2
          backUvsPointer += 12

          if (baseHeightBack && cy < baseHeightBack) {
            // right side baseboard quad vertices
            baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = cy
            baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
            baseVertices[ baseVerticesPointer + 3 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 4 ] = cy
            baseVertices[ baseVerticesPointer + 5 ] = cz
            baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = _yb
            baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = cz
            baseVertices[ baseVerticesPointer + 15 ] = pointer + cl
            baseVertices[ baseVerticesPointer + 16 ] = _yb
            baseVertices[ baseVerticesPointer + 17 ] = azb
            baseVerticesPointer += 18
          }
        }
      }
    }

    // wall above children
    if (round(cy + ch) < ah) {

      // front quad vertices
      frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
      frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
      frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
      frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
      frontVertices[ frontVerticesPointer + 4 ] = cy + ch
      frontVertices[ frontVerticesPointer + 5 ] = azf
      frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
      frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
      frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
      frontVertices[ frontVerticesPointer + 15 ] = pointer
      frontVertices[ frontVerticesPointer + 16 ] = ah
      frontVertices[ frontVerticesPointer + 17 ] = azf
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
      backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
      backVertices[ backVerticesPointer + 3 ] = pointer + cl
      backVertices[ backVerticesPointer + 4 ] = ah
      backVertices[ backVerticesPointer + 5 ] = azb
      backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
      backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy + ch
      backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
      backVertices[ backVerticesPointer + 15 ] = pointer
      backVertices[ backVerticesPointer + 16 ] = cy + ch
      backVertices[ backVerticesPointer + 17 ] = azb
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
      topVertices[ topVerticesPointer + 2 ] = topVertices[ topVerticesPointer + 11 ] = azf
      topVertices[ topVerticesPointer + 3 ] = pointer + cl
      topVertices[ topVerticesPointer + 4 ] = ah
      topVertices[ topVerticesPointer + 5 ] = azf
      topVertices[ topVerticesPointer + 6 ] = topVertices[ topVerticesPointer + 12 ] = pointer + cl
      topVertices[ topVerticesPointer + 7 ] = topVertices[ topVerticesPointer + 13 ] = ah
      topVertices[ topVerticesPointer + 8 ] = topVertices[ topVerticesPointer + 14 ] = azb
      topVertices[ topVerticesPointer + 15 ] = pointer
      topVertices[ topVerticesPointer + 16 ] = ah
      topVertices[ topVerticesPointer + 17 ] = azb
      topVerticesPointer += 18

      // react to opening z-position
      if (azf > cz) {
        // below quad vertices
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = cz
        frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 4 ] = cy + ch
        frontVertices[ frontVerticesPointer + 5 ] = cz
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cy + ch
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = cy + ch
        frontVertices[ frontVerticesPointer + 17 ] = azf
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
      }
      if (cz > azb) {
        // below quad vertices
        backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
        backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy + ch
        backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
        backVertices[ backVerticesPointer + 3 ] = pointer + cl
        backVertices[ backVerticesPointer + 4 ] = cy + ch
        backVertices[ backVerticesPointer + 5 ] = azb
        backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
        backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cy + ch
        backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = cz
        backVertices[ backVerticesPointer + 15 ] = pointer
        backVertices[ backVerticesPointer + 16 ] = cy + ch
        backVertices[ backVerticesPointer + 17 ] = cz
        backVerticesPointer += 18
        // below quad uvs
        backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = pointer
        backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = 0
        backUvs[ backUvsPointer + 2 ] = pointer + cl
        backUvs[ backUvsPointer + 3 ] = 0
        backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = pointer + cl
        backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = aw
        backUvs[ backUvsPointer + 10 ] = pointer
        backUvs[ backUvsPointer + 11 ] = aw
        backUvsPointer += 12
      }

      if (pointer <= 0) {
        // left side quad vertices
        // react to opening z-position
        if (azf > cz) {
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = cz
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = azf
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = ah
          frontVertices[ frontVerticesPointer + 17 ] = cz
          frontVerticesPointer += 18
          // left side quad uvs
          frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
          frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = cy + ch
          frontUvs[ frontUvsPointer + 2 ] = aw
          frontUvs[ frontUvsPointer + 3 ] = cy + ch
          frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = aw
          frontUvs[ frontUvsPointer + 5 ] = frontUvs[ frontUvsPointer + 9 ] = ah
          frontUvs[ frontUvsPointer + 10 ] = 0
          frontUvs[ frontUvsPointer + 11 ] = ah
          frontUvsPointer += 12

        }
        if (cz > azb) {
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy + ch
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
          backVertices[ backVerticesPointer + 3 ] = pointer
          backVertices[ backVerticesPointer + 4 ] = cy + ch
          backVertices[ backVerticesPointer + 5 ] = cz
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = ah
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = cz
          backVertices[ backVerticesPointer + 15 ] = pointer
          backVertices[ backVerticesPointer + 16 ] = ah
          backVertices[ backVerticesPointer + 17 ] = azb
          backVerticesPointer += 18
          // left side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = cy + ch
          backUvs[ backUvsPointer + 2 ] = aw
          backUvs[ backUvsPointer + 3 ] = cy + ch
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = aw
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = ah
          backUvs[ backUvsPointer + 10 ] = 0
          backUvs[ backUvsPointer + 11 ] = ah
          backUvsPointer += 12
        }
      } else if (cPrev && cx === round(cPrev.x + cPrev.l) && round(cPrev.y + cPrev.h) > round(cy + ch)) {

        // adjacent windows
        // left side quad vertices
        // react to opening z-position
        if (azf > cz) {
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = cz
          frontVertices[ frontVerticesPointer + 3 ] = pointer
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = azf
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cPrev.y + cPrev.h
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
          frontVertices[ frontVerticesPointer + 15 ] = pointer
          frontVertices[ frontVerticesPointer + 16 ] = cPrev.y + cPrev.h
          frontVertices[ frontVerticesPointer + 17 ] = cz
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
        if (cz > azb){
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy + ch
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
          backVertices[ backVerticesPointer + 3 ] = pointer
          backVertices[ backVerticesPointer + 4 ] = cy + ch
          backVertices[ backVerticesPointer + 5 ] = cz
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cPrev.y + cPrev.h
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = cz
          backVertices[ backVerticesPointer + 15 ] = pointer
          backVertices[ backVerticesPointer + 16 ] = cPrev.y + cPrev.h
          backVertices[ backVerticesPointer + 17 ] = azb
          backVerticesPointer += 18
          // left side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = cy + ch
          backUvs[ backUvsPointer + 2 ] = aw
          backUvs[ backUvsPointer + 3 ] = cy + ch
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = aw
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = cPrev.y + cPrev.h
          backUvs[ backUvsPointer + 10 ] = 0
          backUvs[ backUvsPointer + 11 ] = cPrev.y + cPrev.h
          backUvsPointer += 12
        }
      }

      if (round(pointer + cl) >= al) {
        // wall ending with opening
        // top, right side quad vertices
        // react to opening z-position
        if (azf > cz) {
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = cz
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = cz
          frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 16 ] = ah
          frontVertices[ frontVerticesPointer + 17 ] = azf
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
        }
        if (cz > azb){
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer + cl
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy + ch
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = cz
          backVertices[ backVerticesPointer + 3 ] = pointer + cl
          backVertices[ backVerticesPointer + 4 ] = cy + ch
          backVertices[ backVerticesPointer + 5 ] = azb
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = ah
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
          backVertices[ backVerticesPointer + 15 ] = pointer + cl
          backVertices[ backVerticesPointer + 16 ] = ah
          backVertices[ backVerticesPointer + 17 ] = cz
          backVerticesPointer += 18
          // right side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = aw
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = cy + ch
          backUvs[ backUvsPointer + 2 ] = 0
          backUvs[ backUvsPointer + 3 ] = cy + ch
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = 0
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = ah
          backUvs[ backUvsPointer + 10 ] = aw
          backUvs[ backUvsPointer + 11 ] = ah
          backUvsPointer += 12
        }

      } else if (cNext && round(cx + cl) === cNext.x && round(cNext.y + cNext.h) > round(cy + ch)) {
        // adjacent windows
        // right side quad vertices top
        // react to opening z-position
        if (azf > cz) {
          frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = cy + ch
          frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
          frontVertices[ frontVerticesPointer + 3 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 4 ] = cy + ch
          frontVertices[ frontVerticesPointer + 5 ] = cz
          frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = cNext.y + cNext.h
          frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = cz
          frontVertices[ frontVerticesPointer + 15 ] = pointer + cl
          frontVertices[ frontVerticesPointer + 16 ] = cNext.y + cNext.h
          frontVertices[ frontVerticesPointer + 17 ] = azf
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
        if (cz > azb){
          backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer + cl
          backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = cy + ch
          backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = cz
          backVertices[ backVerticesPointer + 3 ] = pointer + cl
          backVertices[ backVerticesPointer + 4 ] = cy + ch
          backVertices[ backVerticesPointer + 5 ] = azb
          backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer + cl
          backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = cNext.y + cNext.h
          backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
          backVertices[ backVerticesPointer + 15 ] = pointer + cl
          backVertices[ backVerticesPointer + 16 ] = cNext.y + cNext.h
          backVertices[ backVerticesPointer + 17 ] = cz
          backVerticesPointer += 18
          // right side quad uvs
          backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = aw
          backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = cy + ch
          backUvs[ backUvsPointer + 2 ] = 0
          backUvs[ backUvsPointer + 3 ] = cy + ch
          backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = 0
          backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = cNext.y + cNext.h
          backUvs[ backUvsPointer + 10 ] = aw
          backUvs[ backUvsPointer + 11 ] = cNext.y + cNext.h
          backUvsPointer += 12
        }

      }
    }

    pointer += cl // set new pointer position

  }

  // wall after last children ( or the only wall if there is no children )
  if (pointer < al) {

    // front quad vertices
    frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
    frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
    frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = azf
    frontVertices[ frontVerticesPointer + 3 ] = al
    frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
    frontVertices[ frontVerticesPointer + 5 ] = azf
    frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = al
    frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
    frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
    frontVertices[ frontVerticesPointer + 15 ] = pointer
    frontVertices[ frontVerticesPointer + 16 ] = ah
    frontVertices[ frontVerticesPointer + 17 ] = azf
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
      baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
      baseVertices[ baseVerticesPointer + 3 ] = al
      baseVertices[ baseVerticesPointer + 4 ] = 0
      baseVertices[ baseVerticesPointer + 5 ] = azf
      baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
      baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
      baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
      baseVertices[ baseVerticesPointer + 15 ] = pointer
      baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
      baseVertices[ baseVerticesPointer + 17 ] = azf
      baseVerticesPointer += 18
    }

    // back quad vertices
    backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
    backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = ah
    backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
    backVertices[ backVerticesPointer + 3 ] = al
    backVertices[ backVerticesPointer + 4 ] = ah
    backVertices[ backVerticesPointer + 5 ] = azb
    backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = al
    backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = baseHeightBack
    backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
    backVertices[ backVerticesPointer + 15 ] = pointer
    backVertices[ backVerticesPointer + 16 ] = baseHeightBack
    backVertices[ backVerticesPointer + 17 ] = azb
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
      baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
      baseVertices[ baseVerticesPointer + 3 ] = al
      baseVertices[ baseVerticesPointer + 4 ] = baseHeightBack
      baseVertices[ baseVerticesPointer + 5 ] = azb
      baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
      baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = 0
      baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
      baseVertices[ baseVerticesPointer + 15 ] = pointer
      baseVertices[ baseVerticesPointer + 16 ] = 0
      baseVertices[ baseVerticesPointer + 17 ] = azb
      baseVerticesPointer += 18
    }

    // top quad vertices
    topVertices[ topVerticesPointer ] = topVertices[ topVerticesPointer + 9 ] = pointer
    topVertices[ topVerticesPointer + 1 ] = topVertices[ topVerticesPointer + 10 ] = ah
    topVertices[ topVerticesPointer + 2 ] = topVertices[ topVerticesPointer + 11 ] = azf
    topVertices[ topVerticesPointer + 3 ] = al
    topVertices[ topVerticesPointer + 4 ] = ah
    topVertices[ topVerticesPointer + 5 ] = azf
    topVertices[ topVerticesPointer + 6 ] = topVertices[ topVerticesPointer + 12 ] = al
    topVertices[ topVerticesPointer + 7 ] = topVertices[ topVerticesPointer + 13 ] = ah
    topVertices[ topVerticesPointer + 8 ] = topVertices[ topVerticesPointer + 14 ] = azb
    topVertices[ topVerticesPointer + 15 ] = pointer
    topVertices[ topVerticesPointer + 16 ] = ah
    topVertices[ topVerticesPointer + 17 ] = azb
    topVerticesPointer += 18

    if (pointer === 0) {
      // start face for a wall without openings
      // left side quad vertices
      // react to wall controlLine position
      if (azf > 0) {
        frontVertices[ frontVerticesPointer ] = frontVertices[ frontVerticesPointer + 9 ] = pointer
        frontVertices[ frontVerticesPointer + 1 ] = frontVertices[ frontVerticesPointer + 10 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 2 ] = frontVertices[ frontVerticesPointer + 11 ] = 0
        frontVertices[ frontVerticesPointer + 3 ] = pointer
        frontVertices[ frontVerticesPointer + 4 ] = baseHeightFront
        frontVertices[ frontVerticesPointer + 5 ] = azf
        frontVertices[ frontVerticesPointer + 6 ] = frontVertices[ frontVerticesPointer + 12 ] = pointer
        frontVertices[ frontVerticesPointer + 7 ] = frontVertices[ frontVerticesPointer + 13 ] = ah
        frontVertices[ frontVerticesPointer + 8 ] = frontVertices[ frontVerticesPointer + 14 ] = azf
        frontVertices[ frontVerticesPointer + 15 ] = pointer
        frontVertices[ frontVerticesPointer + 16 ] = ah
        frontVertices[ frontVerticesPointer + 17 ] = 0
        frontVerticesPointer += 18
        // left side quad uvs
        frontUvs[ frontUvsPointer ] = frontUvs[ frontUvsPointer + 6 ] = 0
        frontUvs[ frontUvsPointer + 1 ] = frontUvs[ frontUvsPointer + 7 ] = baseHeightFront
        frontUvs[ frontUvsPointer + 2 ] = azf
        frontUvs[ frontUvsPointer + 3 ] = baseHeightFront
        frontUvs[ frontUvsPointer + 4 ] = frontUvs[ frontUvsPointer + 8 ] = azf
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
          baseVertices[ baseVerticesPointer + 5 ] = azf
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azf
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
          baseVertices[ baseVerticesPointer + 17 ] = 0
          baseVerticesPointer += 18
        }
      }
      if (azb < 0) {
        backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = pointer
        backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = baseHeightBack
        backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = azb
        backVertices[ backVerticesPointer + 3 ] = pointer
        backVertices[ backVerticesPointer + 4 ] = baseHeightBack
        backVertices[ backVerticesPointer + 5 ] = 0
        backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = pointer
        backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = ah
        backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = 0
        backVertices[ backVerticesPointer + 15 ] = pointer
        backVertices[ backVerticesPointer + 16 ] = ah
        backVertices[ backVerticesPointer + 17 ] = azb
        backVerticesPointer += 18
        // left side quad uvs
        backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = 0
        backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = baseHeightBack
        backUvs[ backUvsPointer + 2 ] = azb
        backUvs[ backUvsPointer + 3 ] = baseHeightBack
        backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = azb
        backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = ah
        backUvs[ backUvsPointer + 10 ] = 0
        backUvs[ backUvsPointer + 11 ] = ah
        backUvsPointer += 12

        if (baseHeightBack) {
          // left side baseboard quad vertices
          baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = pointer
          baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
          baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azb
          baseVertices[ baseVerticesPointer + 3 ] = pointer
          baseVertices[ baseVerticesPointer + 4 ] = 0
          baseVertices[ baseVerticesPointer + 5 ] = 0
          baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = pointer
          baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightBack
          baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
          baseVertices[ baseVerticesPointer + 15 ] = pointer
          baseVertices[ baseVerticesPointer + 16 ] = baseHeightBack
          baseVertices[ baseVerticesPointer + 17 ] = azb
          baseVerticesPointer += 18
        }
      }
    }

    // end of the wall - full height face
    // react to wall controlLine position
    if (azf > 0) {
      // right side quad vertices
      frontVertices[frontVerticesPointer] = frontVertices[frontVerticesPointer + 9] = al
      frontVertices[frontVerticesPointer + 1] = frontVertices[frontVerticesPointer + 10] = baseHeightFront
      frontVertices[frontVerticesPointer + 2] = frontVertices[frontVerticesPointer + 11] = azf
      frontVertices[frontVerticesPointer + 3] = al
      frontVertices[frontVerticesPointer + 4] = baseHeightFront
      frontVertices[frontVerticesPointer + 5] = 0
      frontVertices[frontVerticesPointer + 6] = frontVertices[frontVerticesPointer + 12] = al
      frontVertices[frontVerticesPointer + 7] = frontVertices[frontVerticesPointer + 13] = ah
      frontVertices[frontVerticesPointer + 8] = frontVertices[frontVerticesPointer + 14] = 0
      frontVertices[frontVerticesPointer + 15] = al
      frontVertices[frontVerticesPointer + 16] = ah
      frontVertices[frontVerticesPointer + 17] = azf
      frontVerticesPointer += 18
      // right side quad uvs
      frontUvs[frontUvsPointer] = frontUvs[frontUvsPointer + 6] = azf
      frontUvs[frontUvsPointer + 1] = frontUvs[frontUvsPointer + 7] = baseHeightFront
      frontUvs[frontUvsPointer + 2] = 0
      frontUvs[frontUvsPointer + 3] = baseHeightFront
      frontUvs[frontUvsPointer + 4] = frontUvs[frontUvsPointer + 8] = 0
      frontUvs[frontUvsPointer + 5] = frontUvs[frontUvsPointer + 9] = ah
      frontUvs[frontUvsPointer + 10] = azf
      frontUvs[frontUvsPointer + 11] = ah
      frontUvsPointer += 12

      if (baseHeightFront) {
        // right side baseboard quad
        baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = al
        baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = azf
        baseVertices[ baseVerticesPointer + 3 ] = al
        baseVertices[ baseVerticesPointer + 4 ] = 0
        baseVertices[ baseVerticesPointer + 5 ] = 0
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = 0
        baseVertices[ baseVerticesPointer + 15 ] = al
        baseVertices[ baseVerticesPointer + 16 ] = baseHeightFront
        baseVertices[ baseVerticesPointer + 17 ] = azf
        baseVerticesPointer += 18
      }
    }
    if (azb < 0) {
      // right side quad vertices
      backVertices[ backVerticesPointer ] = backVertices[ backVerticesPointer + 9 ] = al
      backVertices[ backVerticesPointer + 1 ] = backVertices[ backVerticesPointer + 10 ] = baseHeightBack
      backVertices[ backVerticesPointer + 2 ] = backVertices[ backVerticesPointer + 11 ] = 0
      backVertices[ backVerticesPointer + 3 ] = al
      backVertices[ backVerticesPointer + 4 ] = baseHeightBack
      backVertices[ backVerticesPointer + 5 ] = azb
      backVertices[ backVerticesPointer + 6 ] = backVertices[ backVerticesPointer + 12 ] = al
      backVertices[ backVerticesPointer + 7 ] = backVertices[ backVerticesPointer + 13 ] = ah
      backVertices[ backVerticesPointer + 8 ] = backVertices[ backVerticesPointer + 14 ] = azb
      backVertices[ backVerticesPointer + 15 ] = al
      backVertices[ backVerticesPointer + 16 ] = ah
      backVertices[ backVerticesPointer + 17 ] = 0
      backVerticesPointer += 18
      // right side quad uvs
      backUvs[ backUvsPointer ] = backUvs[ backUvsPointer + 6 ] = azb
      backUvs[ backUvsPointer + 1 ] = backUvs[ backUvsPointer + 7 ] = baseHeightBack
      backUvs[ backUvsPointer + 2 ] = 0
      backUvs[ backUvsPointer + 3 ] = baseHeightBack
      backUvs[ backUvsPointer + 4 ] = backUvs[ backUvsPointer + 8 ] = 0
      backUvs[ backUvsPointer + 5 ] = backUvs[ backUvsPointer + 9 ] = ah
      backUvs[ backUvsPointer + 10 ] = azb
      backUvs[ backUvsPointer + 11 ] = ah
      backUvsPointer += 12

      if (baseHeightBack) {
        // right side baseboard quad
        baseVertices[ baseVerticesPointer ] = baseVertices[ baseVerticesPointer + 9 ] = al
        baseVertices[ baseVerticesPointer + 1 ] = baseVertices[ baseVerticesPointer + 10 ] = 0
        baseVertices[ baseVerticesPointer + 2 ] = baseVertices[ baseVerticesPointer + 11 ] = 0
        baseVertices[ baseVerticesPointer + 3 ] = al
        baseVertices[ baseVerticesPointer + 4 ] = 0
        baseVertices[ baseVerticesPointer + 5 ] = azb
        baseVertices[ baseVerticesPointer + 6 ] = baseVertices[ baseVerticesPointer + 12 ] = al
        baseVertices[ baseVerticesPointer + 7 ] = baseVertices[ baseVerticesPointer + 13 ] = baseHeightBack
        baseVertices[ baseVerticesPointer + 8 ] = baseVertices[ baseVerticesPointer + 14 ] = azb
        baseVertices[ baseVerticesPointer + 15 ] = al
        baseVertices[ baseVerticesPointer + 16 ] = baseHeightBack
        baseVertices[ baseVerticesPointer + 17 ] = 0
        baseVerticesPointer += 18
      }
    }
  }

  return Promise.resolve({
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
  })
}


// helpers

function round (x) {
  return Math.round(x * 1000000) / 1000000
}
