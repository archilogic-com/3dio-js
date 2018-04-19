'use strict';

import getMaterial from '../../../scene/structure/parametric-objects/common/get-material.js'
import generatePolygonBuffer from '../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'
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

  // a polygon can not have less than 3 points
  if (a.polygon.length < 3) {
    console.warn("Invalid Polyfloor: Less than 3   ")
    //TODO untangle this
    if (this.model) {
      this.model.a.parent.remove(this.model)
    }
    return Promise.resolve({
      meshes: {}
    })
  }

  // prepare format
  var vertices = []
  for (var i = 0, l = a.polygon.length; i < l; i++) {
    vertices[ i * 2 ] = a.polygon[ i ][ 0 ]
    vertices[ i * 2 + 1 ] = a.polygon[ i ][ 1 ]
  }

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
