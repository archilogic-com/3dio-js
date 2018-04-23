'use strict';

import generatePolygonBuffer from '../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../utils/data3d/buffer/get-uvs'
import getMaterials3d from './common/get-materials'

export default function getData3d(attributes) {
  return Promise.all([
    generateMeshes3d(attributes),
    getMaterials3d(attributes.materials, getDefaultMaterials())
  ]).then(results => ({
    meshes: results[0],
    materials: results[1]
  }))
}

export function getDefaultMaterials(){
  return {
    top: 'wood_parquet_oak',
    side: 'basic-wall',
    ceiling: 'basic-ceiling'
  }
}

export function generateMeshes3d(a) {

  // 2d polygon vertices
  var vertices = [ 0, 0, 0, a.w, a.l, a.w, a.l, 0 ]

  // top polygon
  var topPolygon = generatePolygonBuffer({
    outline: vertices,
    y: 0,
    uvx: a.x,
    uvz: a.z
  })

  // ceiling polygon
  var ceilingPolygon
  if (a.hasCeiling) {
    ceilingPolygon = generatePolygonBuffer({
      outline: vertices,
      y: a.hCeiling,
      uvx: a.x,
      uvz: a.z,
      flipSide: true
    })
  } else {
    ceilingPolygon = {
      vertices: new Float32Array(0),
      uvs: new Float32Array(0)
    }
  }

  // sides
  var sides = generateExtrusionBuffer({
    outline: vertices,
    y: -a.h,
    flipSide: true
  })

  // return meshes
  return Promise.resolve({
    top: {
      positions: topPolygon.vertices,
      normals: generateNormals.flat(topPolygon.vertices),
      uvs: topPolygon.uvs,
      material: 'top'
    },
    sides: {
      positions: sides.vertices,
      normals: generateNormals.flat(sides.vertices),
      uvs: sides.uvs,
      material: 'side'
    },
    ceiling: {
      positions: ceilingPolygon.vertices,
      normals: generateNormals.flat(ceilingPolygon.vertices),
      uvs: ceilingPolygon.uvs,
      material: 'ceiling'
    }
  })
}
