'use strict';

// dependencies

import getSchema from './common/get-schema.js'
import getMaterial from './common/get-material.js'
import generatePolygonBuffer from '../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import cloneDeep from 'lodash/cloneDeep'

export default {

  schema: getSchema('polyfloor'),

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
      top: 'wood_parquet_oak',
      side: 'basic-wall',
      ceiling: 'basic-ceiling'
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

    console.log('polyfloor', a.polygon)
    // a polygon can not have less than 3 points
    if (a.polygon.length < 3) {
      if (this.model) {
        this.model.a.parent.remove(this.model)
      }
      return Promise.resolve({
        meshes: {}
      })
    }

    // prepare format
    var vertices = a.polygon //[]
    // for (var i = 0, l = a.polygon.length; i < l; i++) {
    //   vertices[ i * 2 ] = a.polygon[ i ][ 0 ]
    //   vertices[ i * 2 + 1 ] = a.polygon[ i ][ 1 ]
    // }

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
    return {
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
    }
  }
}