'use strict';

// dependencies

import generatePolygonBuffer from '../../../../utils/data3d/buffer/get-polygon'
import generateExtrusionBuffer from '../../../../utils/data3d/buffer/get-extrusion'
import generateNormals from '../../../../utils/data3d/buffer/get-normals'

// definition

export default {

  params: {

    type: 'floor',

    x: 0,
    y: 0,
    z: 0,

    ry: 0,

    l: 4,
    w: 4,
    h: 0.2,

    lock: false,

    bake: true,
    bakeStatus: 'none', // none, pending, done

    materials: {
      top: 'basic-floor',
      side: 'basic-wall',
      ceiling: 'basic-ceiling'
    },

    hasCeiling: true,
    hCeiling: 2.4

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
    },
    l: {
      step: 0.05
    },
    w: {
      step: 0.05
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

  },

  bindings: [{
    events: [
      'change:hasCeiling'
    ],
    call: 'contextMenu'
  },{
    events: [
      'change:x',
      'change:z',
      'change:l',
      'change:w',
      'change:h',
      'change:hasCeiling',
      'change:hCeiling'
    ],
    call: 'meshes3d'
  },{
    events: [
      'change:materials.*'
    ],
    call: 'materials3d'
  }],

  contextMenu: function generateContectMenu () {

    var contextMenu = {
      templateId: 'generic',
      templateOptions: {
        title: 'Floor'
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
          subscriptions: ['pro', 'modeller', 'artist3d']
        },
        {
          type: 'html',
          display: '<h2>Materials<h2>'
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

    return contextMenu

  },

  loadingQueuePrefix: 'architecture',

  controls3d: 'floor',

  meshes3d: function generateMeshes3d () {

    var a = this.a

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

  materials3d: function generateMaterials3d() {
    return this.a.materials
  }

}
