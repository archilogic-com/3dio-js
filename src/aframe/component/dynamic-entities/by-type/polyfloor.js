'use strict';

// dependencies

import generatePolygonBuffer from '../../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../../utils/data3d/buffer/get-normals'

// definition

export default {

  params: {

    type: 'polyfloor',

    x: 0,
    y: 0,
    z: 0,

    ry: 0,

    h: 0.2,

    lock: false,

    bake: true,
    bakeStatus: 'none', // none, pending, done

    materials: {
      top: 'wood_parquet_oak',
      side: 'basic-wall',
      ceiling: 'basic-ceiling'
    },

    hasCeiling: true,
    hCeiling: 2.4,

    polygon: [
      [ 1.5, 1.5 ],
      [ 1.5, -1.5 ],
      [ -1.5, -1.5 ],
      [ -1.5, 1.5 ]
    ],

    _afFurnishings: undefined,
    _afGroups: undefined,
    _afShuffleIndex: undefined,
    _afAddedGroups: undefined,
    _afStyle: 'generic'

  },

  valid: {
    children: [],
    x: {
      step: 0.05
    },
    y: {
      lock: true
    },
    z: {
      step: 0.05
    },
    ry: {
      lock: false
    }
  },

  initialize: function(){

    // backwards compatibility
    if (this.a.material) {
      this.a.materials.top = this.a.material
      delete this.a.material
    }
    if (this.a.ceilingMaterial) {
      this.a.materials.ceiling = this.a.ceilingMaterial
      delete this.a.ceilingMaterial
    }
    if (this.a.side) {
      this.a.materials.side = this.a.sideMaterial
      delete this.a.sideMaterial
    }
    // on the fly migration of 'old' usage combination
    if (this.a.usage === 'living,dining') this.a.usage = 'dining_living'
    if (this.a.usage === 'office') this.a.usage = 'homeOffice'

  },

  contextMenu: function gerContextMenu (){

    var contextMenu = {
      templateId: 'generic',
      templateOptions: {
        title: 'Polyfloor'
      },
      controls: [
        {
          title: 'Has Ceiling',
          type: 'boolean',
          param: 'hasCeiling'
        },
        {
          title: 'Ceiling Height',
          type: 'number',
          param: 'hCeiling',
          unit: 'm',
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
          title: 'Height',
          type: 'number',
          param: 'h',
          unit: 'm',
          step: 0.05,
          round: 0.01
        },
        {
          title: 'Lock this item',
          type: 'boolean',
          param: 'locked',
          subscriptions: [ 'pro', 'modeller', 'artist3d' ]
        },
        {
          display: '<h2>Materials</h2>',
          type: 'html'
        },
        {
          title: 'Floor',
          type: 'material',
          param: 'materials.top',
          category: 'floor'
        },
        {
          title: 'Side',
          type: 'material',
          param: 'materials.side',
          category: 'wall'
        }
      ]
    }


    if (this.params.hasCeiling) {
      contextMenu.controls.push({
        title: 'Ceiling',
        type: 'material',
        param: 'materials.ceiling',
        category: 'ceiling'
      })
    }

    var usageList = {
      'Living': 'living',
      'Living & Dining': 'dining_living',
      'Home office': 'homeOffice',
      'Bedroom': 'bedroom',
      'Dining': 'dining',
      'Bathroom': 'bathroom'
    }

    if (self.vm.user.a.isDev && !config.isProduction) {
      usageList['Office Working'] = 'officeWorking'
      usageList['Office Meeting'] = 'officeMeeting'
    }

    return contextMenu

  },

  bindings: [ {
    events: [
      'change:_afFurnishings',
      'change:hasCeiling'
    ],
    call: 'contextMenu'
  }, {
    events: [
      'change:x',
      'change:z',
      'change:h',
      'change:polygon',
      'change:hasCeiling',
      'change:hCeiling'
    ],
    call: 'meshes3d'
  }, {
    events: [
      'change:materials.*'
    ],
    call: 'materials3d'
  }],

  loadingQueuePrefix: 'architecture',

  controls3d: 'polyFloor',

  meshes3d: function generateMeshes3d (a) {

    //var a = this.a

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

  },

  materials3d: function generateMaterials3d(a) {
    return a.materials
  }

}