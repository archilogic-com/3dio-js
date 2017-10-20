
'use strict';

// dependencies

import generateNormals from '../../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../../utils/data3d/buffer/get-uvs'

// class

export default {

  params: {

    type: 'closet',
    v: 1,        // version

    x: 0,
    y: 0,
    z: 0,

    ry: 0,

    lock: false,

    bake: true,
    bakeStatus: 'none', // none, pending, done

    // geometry params
    l: 1.8,      // length
    w: 0.6,      // width (=thickness)
    h: 2.4,      // height
    baseboard: 0.1,
    doorWidth: 0.02,
    handleLength: 0.02,
    handleWidth: 0.02,
    handleHeight: 0.3,

    //stepColor: 0x00609f,

    materials: {
      closet: 'cabinet_paint_white'
    }

  },

  valid: {
    children: [],
    x: {
      step: 0.05
    },
    y: {
      step: 0.05
    },
    z: {
      step: 0.05
    },
    ry: {
      snap: 45
    },
    l: {
      min: 0.6,
      //max: 4,
      step: 0.05
    }
  },

  initialize: function(){

    // backwards compatibility
    if (this.a.closetMaterial) {
      this.a.materials.closet = this.a.closetMaterial
      delete this.a.closetMaterial
    }

  },

  bindings: [{
    events: [
      'change:l',
      'change:w',
      'change:h',
      'change:baseboard',
      'change:doorWidth',
      'change:handleLength',
      'change:handleWidth',
      'change:handleHeight'
    ],
    call: 'meshes3d'
  },{
    events: [
      'change:materials.*'
    ],
    call: 'materials3d'
  }],

  contextMenu: {
    templateId: 'generic',
    templateOptions: {
      title: 'Closet'
    },
    controls: [
      {
        title: 'Height',
        type: 'number',
        param: 'h',
        unit: 'm',
        min: 1,
        max: 4,
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
        min: 0.1,
        max: 0.8,
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
        title: 'Lock this item',
        type: 'boolean',
        param: 'locked',
        subscriptions: ['pro', 'modeller', 'artist3d']
      },
      {
        title: 'Material',
        type: 'material',
        param: 'materials.closet',
        category: 'cabinet'
      }
    ]
  },

  loadingQueuePrefix: 'architecture',

  controls3d: 'twoPoints',

  meshes3d: function generateMeshes3d() {

    var a = this.a
    var wallThickness = 10
    if (a.parent && a.parent.a) {
      wallThickness = a.parent.a.w
    }
    var step = 0,
      elementNum = Math.round(a.l/0.6),
      elementLength = a.l/elementNum,
      handlePos = elementLength*0.8,
      //handleWidth = a.handleWidth+ a.doorWidth,
      handleDistance = 0.05,
      offsetY = -0.01,

      // internals
      closetVertices = [],
      cvPos = 0

    //CLOSET DOORS

    // FRONT VIEW VERTICES
    //
    // A------------C
    // |E\I------G\K|
    // | |        | |
    // | |M\Q-O\S | |
    // | ||   |   | |
    // | |N\R-P\T | |
    // |F\J------H\L|
    // B------------D

    var aX = step,
      aY = a.h + offsetY,
      aZ = a.w,
      bY = 0,
      cX = step+elementLength,
      eX = step+a.doorWidth/2,
      eY = a.h-a.doorWidth,
      fY = a.baseboard,
      gX = step+elementLength-a.doorWidth/2,
      iZ = a.w+a.doorWidth,
      mX = step+handlePos,
      mY = 1+a.handleHeight/2,
      nY = 1-a.handleHeight/2,
      oX = step+handlePos+a.handleLength,
      qZ = a.w+a.doorWidth+ a.handleWidth

    for(var c = 0; c<elementNum; c++){

      if(c % 2 == 1 || c===elementNum-1 ){
        handlePos = handleDistance + a.handleLength/2
      }
      else{
        handlePos = elementLength-handleDistance- a.handleLength/2
      }
      aX = step
      cX = step+elementLength
      eX = step+ a.doorWidth/2
      gX = step+elementLength- a.doorWidth/2
      mX = step+handlePos- a.handleLength/2
      oX = step+handlePos+ a.handleLength/2

      // DOOR FRAME
      //A
      closetVertices[cvPos] = closetVertices[cvPos+9] = aX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = aY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
      //B
      closetVertices[cvPos+3] = aX
      closetVertices[cvPos+4] = bY
      closetVertices[cvPos+5] = aZ
      //F
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = eX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = fY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
      //E
      closetVertices[cvPos+15] = eX
      closetVertices[cvPos+16] = eY
      closetVertices[cvPos+17] = aZ

      cvPos = cvPos+18

      //F
      closetVertices[cvPos] = closetVertices[cvPos+9] = eX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = fY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
      //B
      closetVertices[cvPos+3] = aX
      closetVertices[cvPos+4] = bY
      closetVertices[cvPos+5] = aZ
      //D
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = cX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = bY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
      //H
      closetVertices[cvPos+15] = gX
      closetVertices[cvPos+16] = fY
      closetVertices[cvPos+17] = aZ

      cvPos = cvPos+18

      //G
      closetVertices[cvPos] = closetVertices[cvPos+9] = gX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = eY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
      //H
      closetVertices[cvPos+3] = gX
      closetVertices[cvPos+4] = fY
      closetVertices[cvPos+5] = aZ
      //D
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = cX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = bY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
      //C
      closetVertices[cvPos+15] = cX
      closetVertices[cvPos+16] = aY
      closetVertices[cvPos+17] = aZ

      cvPos = cvPos+18

      //A
      closetVertices[cvPos] = closetVertices[cvPos+9] = aX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = aY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
      //E
      closetVertices[cvPos+3] = eX
      closetVertices[cvPos+4] = eY
      closetVertices[cvPos+5] = aZ
      //G
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = gX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = eY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
      //C
      closetVertices[cvPos+15] = cX
      closetVertices[cvPos+16] = aY
      closetVertices[cvPos+17] = aZ

      cvPos = cvPos+18

      // DOOR LEAF

      //E
      closetVertices[cvPos] = closetVertices[cvPos+9] = eX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = eY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
      //F
      closetVertices[cvPos+3] = eX
      closetVertices[cvPos+4] = fY
      closetVertices[cvPos+5] = aZ
      //J
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = eX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = fY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = iZ
      //I
      closetVertices[cvPos+15] = eX
      closetVertices[cvPos+16] = eY
      closetVertices[cvPos+17] = iZ

      cvPos = cvPos+18

      //J
      closetVertices[cvPos] = closetVertices[cvPos+9] = eX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = fY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = iZ
      //F
      closetVertices[cvPos+3] = eX
      closetVertices[cvPos+4] = fY
      closetVertices[cvPos+5] = aZ
      //H
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = gX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = fY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
      //L
      closetVertices[cvPos+15] = gX
      closetVertices[cvPos+16] = fY
      closetVertices[cvPos+17] = iZ

      cvPos = cvPos+18

      //K
      closetVertices[cvPos] = closetVertices[cvPos+9] = gX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = eY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = iZ
      //L
      closetVertices[cvPos+3] = gX
      closetVertices[cvPos+4] = fY
      closetVertices[cvPos+5] = iZ
      //H
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = gX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = fY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
      //G
      closetVertices[cvPos+15] = gX
      closetVertices[cvPos+16] = eY
      closetVertices[cvPos+17] = aZ

      cvPos = cvPos+18

      //E
      closetVertices[cvPos] = closetVertices[cvPos+9] = eX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = eY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
      //I
      closetVertices[cvPos+3] = eX
      closetVertices[cvPos+4] = eY
      closetVertices[cvPos+5] = iZ
      //K
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = gX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = eY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = iZ
      //G
      closetVertices[cvPos+15] = gX
      closetVertices[cvPos+16] = eY
      closetVertices[cvPos+17] = aZ

      cvPos = cvPos+18

      //I
      closetVertices[cvPos] = closetVertices[cvPos+9] = eX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = eY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = iZ
      //J
      closetVertices[cvPos+3] = eX
      closetVertices[cvPos+4] = fY
      closetVertices[cvPos+5] = iZ
      //N
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = mX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = nY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = iZ
      //M
      closetVertices[cvPos+15] = mX
      closetVertices[cvPos+16] = mY
      closetVertices[cvPos+17] = iZ

      cvPos = cvPos+18

      //N
      closetVertices[cvPos] = closetVertices[cvPos+9] = mX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = nY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = iZ
      //J
      closetVertices[cvPos+3] = eX
      closetVertices[cvPos+4] = fY
      closetVertices[cvPos+5] = iZ
      //L
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = gX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = fY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = iZ
      //P
      closetVertices[cvPos+15] = oX
      closetVertices[cvPos+16] = nY
      closetVertices[cvPos+17] = iZ

      cvPos = cvPos+18

      //O
      closetVertices[cvPos] = closetVertices[cvPos+9] = oX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = mY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = iZ
      //P
      closetVertices[cvPos+3] = oX
      closetVertices[cvPos+4] = nY
      closetVertices[cvPos+5] = iZ
      //L
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = gX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = fY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = iZ
      //K
      closetVertices[cvPos+15] = gX
      closetVertices[cvPos+16] = eY
      closetVertices[cvPos+17] = iZ

      cvPos = cvPos+18

      //I
      closetVertices[cvPos] = closetVertices[cvPos+9] = eX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = eY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = iZ
      //M
      closetVertices[cvPos+3] = mX
      closetVertices[cvPos+4] = mY
      closetVertices[cvPos+5] = iZ
      //O
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = oX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = mY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = iZ
      //K
      closetVertices[cvPos+15] = gX
      closetVertices[cvPos+16] = eY
      closetVertices[cvPos+17] = iZ

      cvPos = cvPos+18

      // HANDLE
      if (a.handleWidth >0 ) {
        // HANDLE SIDES
        //M
        closetVertices[cvPos] = closetVertices[cvPos + 9] = mX
        closetVertices[cvPos + 1] = closetVertices[cvPos + 10] = mY
        closetVertices[cvPos + 2] = closetVertices[cvPos + 11] = iZ
        //N
        closetVertices[cvPos + 3] = mX
        closetVertices[cvPos + 4] = nY
        closetVertices[cvPos + 5] = iZ
        //R
        closetVertices[cvPos + 6] = closetVertices[cvPos + 12] = mX
        closetVertices[cvPos + 7] = closetVertices[cvPos + 13] = nY
        closetVertices[cvPos + 8] = closetVertices[cvPos + 14] = qZ
        //Q
        closetVertices[cvPos + 15] = mX
        closetVertices[cvPos + 16] = mY
        closetVertices[cvPos + 17] = qZ

        cvPos = cvPos + 18

        //R
        closetVertices[cvPos] = closetVertices[cvPos + 9] = mX
        closetVertices[cvPos + 1] = closetVertices[cvPos + 10] = nY
        closetVertices[cvPos + 2] = closetVertices[cvPos + 11] = qZ
        //N
        closetVertices[cvPos + 3] = mX
        closetVertices[cvPos + 4] = nY
        closetVertices[cvPos + 5] = iZ
        //P
        closetVertices[cvPos + 6] = closetVertices[cvPos + 12] = oX
        closetVertices[cvPos + 7] = closetVertices[cvPos + 13] = nY
        closetVertices[cvPos + 8] = closetVertices[cvPos + 14] = iZ
        //T
        closetVertices[cvPos + 15] = oX
        closetVertices[cvPos + 16] = nY
        closetVertices[cvPos + 17] = qZ

        cvPos = cvPos + 18

        //S
        closetVertices[cvPos] = closetVertices[cvPos + 9] = oX
        closetVertices[cvPos + 1] = closetVertices[cvPos + 10] = mY
        closetVertices[cvPos + 2] = closetVertices[cvPos + 11] = qZ
        //T
        closetVertices[cvPos + 3] = oX
        closetVertices[cvPos + 4] = nY
        closetVertices[cvPos + 5] = qZ
        //P
        closetVertices[cvPos + 6] = closetVertices[cvPos + 12] = oX
        closetVertices[cvPos + 7] = closetVertices[cvPos + 13] = nY
        closetVertices[cvPos + 8] = closetVertices[cvPos + 14] = iZ
        //O
        closetVertices[cvPos + 15] = oX
        closetVertices[cvPos + 16] = mY
        closetVertices[cvPos + 17] = iZ

        cvPos = cvPos + 18

        //M
        closetVertices[cvPos] = closetVertices[cvPos + 9] = mX
        closetVertices[cvPos + 1] = closetVertices[cvPos + 10] = mY
        closetVertices[cvPos + 2] = closetVertices[cvPos + 11] = iZ
        //Q
        closetVertices[cvPos + 3] = mX
        closetVertices[cvPos + 4] = mY
        closetVertices[cvPos + 5] = qZ
        //S
        closetVertices[cvPos + 6] = closetVertices[cvPos + 12] = oX
        closetVertices[cvPos + 7] = closetVertices[cvPos + 13] = mY
        closetVertices[cvPos + 8] = closetVertices[cvPos + 14] = qZ
        //O
        closetVertices[cvPos + 15] = oX
        closetVertices[cvPos + 16] = mY
        closetVertices[cvPos + 17] = iZ

        cvPos = cvPos + 18
      }
      // HANDLE FRONT
      //Q
      closetVertices[cvPos] = closetVertices[cvPos+9] = mX
      closetVertices[cvPos+1] = closetVertices[cvPos+10] = mY
      closetVertices[cvPos+2] = closetVertices[cvPos+11] = qZ
      //R
      closetVertices[cvPos+3] = mX
      closetVertices[cvPos+4] = nY
      closetVertices[cvPos+5] = qZ
      //T
      closetVertices[cvPos+6] = closetVertices[cvPos+12] = oX
      closetVertices[cvPos+7] = closetVertices[cvPos+13] = nY
      closetVertices[cvPos+8] = closetVertices[cvPos+14] = qZ
      //S
      closetVertices[cvPos+15] = oX
      closetVertices[cvPos+16] = mY
      closetVertices[cvPos+17] = qZ

      cvPos = cvPos+18

      step += elementLength;
    }

    //CLOSET BOX

    // FRONT VIEW VERTICES
    //
    // A/E---C/G
    //  |     |
    //  |     |
    //  |     |
    // B/F---D/H

    aX = 0
    aY = a.h + offsetY
    aZ = a.w
    bY = 0
    cX = a.l
    var eZ = 0

    //E
    closetVertices[cvPos] = closetVertices[cvPos+9] = aX
    closetVertices[cvPos+1] = closetVertices[cvPos+10] = aY
    closetVertices[cvPos+2] = closetVertices[cvPos+11] = eZ
    //F
    closetVertices[cvPos+3] = aX
    closetVertices[cvPos+4] = bY
    closetVertices[cvPos+5] = eZ
    //B
    closetVertices[cvPos+6] = closetVertices[cvPos+12] = aX
    closetVertices[cvPos+7] = closetVertices[cvPos+13] = bY
    closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
    //A
    closetVertices[cvPos+15] = aX
    closetVertices[cvPos+16] = aY
    closetVertices[cvPos+17] = aZ

    cvPos = cvPos+18

    //E
    closetVertices[cvPos] = closetVertices[cvPos+9] = aX
    closetVertices[cvPos+1] = closetVertices[cvPos+10] = aY
    closetVertices[cvPos+2] = closetVertices[cvPos+11] = eZ
    //A
    closetVertices[cvPos+3] = aX
    closetVertices[cvPos+4] = aY
    closetVertices[cvPos+5] = aZ
    //C
    closetVertices[cvPos+6] = closetVertices[cvPos+12] = cX
    closetVertices[cvPos+7] = closetVertices[cvPos+13] = aY
    closetVertices[cvPos+8] = closetVertices[cvPos+14] = aZ
    //G
    closetVertices[cvPos+15] = cX
    closetVertices[cvPos+16] = aY
    closetVertices[cvPos+17] = eZ

    cvPos = cvPos+18

    //C
    closetVertices[cvPos] = closetVertices[cvPos+9] = cX
    closetVertices[cvPos+1] = closetVertices[cvPos+10] = aY
    closetVertices[cvPos+2] = closetVertices[cvPos+11] = aZ
    //D
    closetVertices[cvPos+3] = cX
    closetVertices[cvPos+4] = bY
    closetVertices[cvPos+5] = aZ
    //H
    closetVertices[cvPos+6] = closetVertices[cvPos+12] = cX
    closetVertices[cvPos+7] = closetVertices[cvPos+13] = bY
    closetVertices[cvPos+8] = closetVertices[cvPos+14] = eZ
    //G
    closetVertices[cvPos+15] = cX
    closetVertices[cvPos+16] = aY
    closetVertices[cvPos+17] = eZ

    cvPos = cvPos+18

    //G
    closetVertices[cvPos] = closetVertices[cvPos+9] = cX
    closetVertices[cvPos+1] = closetVertices[cvPos+10] = aY
    closetVertices[cvPos+2] = closetVertices[cvPos+11] = eZ
    //H
    closetVertices[cvPos+3] = cX
    closetVertices[cvPos+4] = bY
    closetVertices[cvPos+5] = eZ
    //F
    closetVertices[cvPos+6] = closetVertices[cvPos+12] = aX
    closetVertices[cvPos+7] = closetVertices[cvPos+13] = bY
    closetVertices[cvPos+8] = closetVertices[cvPos+14] = eZ
    //E
    closetVertices[cvPos+15] = aX
    closetVertices[cvPos+16] = aY
    closetVertices[cvPos+17] = eZ

    return {
      closet: {
        positions: new Float32Array(closetVertices),
        normals: generateNormals.flat(closetVertices),
        uvs: generateUvs.architectural(closetVertices),
        material: 'closet'
      }
    }

  },

  materials3d: function generateMaterials3d() {
    return this.a.materials
  }

}
