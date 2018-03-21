'use strict';

import generateNormals from '../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../utils/data3d/buffer/get-uvs'
import generatePolygonBuffer from '../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../utils/data3d/buffer/get-extrusion'
import getMaterials3d from './common/get-materials'

export default function getData3d(attributes) {
    return Promise.all([
      generateMeshes3d(attributes),
      getMaterials3d(attributes.materials)
    ]).then(results => ({
      meshes: results[0],
      materials: results[1]
    }))
  }

export function generateMeshes3d (a) {

  // config
  var circleEdgeLength = 0.1
  var minCircleEdges = 12

  // internals
  var vertices = []
  var sideUvs = []
  var radius = a.l / 2
  var shape = a.shape
  var edgeCount = 4

  // for circles set edge count from radius
  if (shape === 'circle') edgeCount = Math.max(Math.floor(radius * Math.PI * 2 / circleEdgeLength), minCircleEdges)
  var stepAngle = Math.PI * 2 / edgeCount

  // for square get diagonal from edge length
  if (shape === 'square') radius = radius / Math.cos(stepAngle / 2)
  // edgeLength needed for correct side uvs
  var edgeLength = Math.tan(stepAngle / 2) * radius * 2

  // get contour vertices and side face uvs
  var svUvPos = 0
  var aX, aY, bY, cX
  for (var i = 0; i < edgeCount * 2; i += 2) {
    /* */
    vertices[i] = Math.sin(stepAngle * i / 2 - stepAngle / 2) * radius
    vertices[i + 1] = Math.cos(stepAngle * i / 2 - stepAngle / 2) * radius

    // create UVS manually to have a continuous texture
    // FRONT UVS
    // A-----D
    // |     |
    // |     |
    // |     |
    // B-----C
    aX = i / 2 * edgeLength
    aY = a.h
    bY = 0
    cX = (i / 2 + 1) * edgeLength
    // B
    sideUvs[svUvPos] = aX
    sideUvs[svUvPos + 1] = bY
    // C
    sideUvs[svUvPos + 2] = cX
    sideUvs[svUvPos + 3] = bY
    // A
    sideUvs[svUvPos + 4] = aX
    sideUvs[svUvPos + 5] = aY
    // A
    sideUvs[svUvPos + 6] = aX
    sideUvs[svUvPos + 7] = aY
    // C
    sideUvs[svUvPos + 8] = cX
    sideUvs[svUvPos + 9] = bY
    // D
    sideUvs[svUvPos + 10] = cX
    sideUvs[svUvPos + 11] = aY
    svUvPos += 12
  }

  // top polygon
  var topPolygon = generatePolygonBuffer({
    outline: vertices,
    y: a.h,
    uvx: a.x,
    uvz: a.z,
    flipSide: false
  })

  // bottom polygon
  var bottomPolygon = generatePolygonBuffer({
    outline: vertices,
    y: 0,
    uvx: a.x,
    uvz: a.z,
    flipSide: true
  })

  // sides
  var sidesFaces = generateExtrusionBuffer({
    outline: vertices,
    y: a.h,
    flipSide: false
  })

  // set normal smoothing according to shape
  var sideNormals
  if (shape === 'circle') sideNormals = generateNormals.smooth(sidesFaces.vertices)
  else sideNormals = generateNormals.flat(sidesFaces.vertices)


  // return meshes
  return Promise.resolve({
    top: {
      positions: topPolygon.vertices,
      normals: generateNormals.flat(topPolygon.vertices),
      uvs: topPolygon.uvs,
      material: 'top'
    },
    sides: {
      positions: sidesFaces.vertices,
      normals: sideNormals,
      uvs: new Float32Array(sideUvs),
      material: 'side'
    },
    bottom: {
      positions: bottomPolygon.vertices,
      normals: generateNormals.flat(bottomPolygon.vertices),
      uvs: bottomPolygon.uvs,
      material: 'side'
    }
  });
}

export function generateMaterials3d(){
  return []
}
