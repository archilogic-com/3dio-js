'use strict';

import getMaterial from '../../../scene/structure/parametric-objects/common/get-material.js'
import generateNormals from '../../../utils/data3d/buffer/get-normals'
import generateUvs from '../../../utils/data3d/buffer/get-uvs'
import cloneDeep from 'lodash/cloneDeep'
import getMaterials3d from './common/get-materials'

export default function(attributes) {
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
    steps: 'basic-wall',
    tread: 'wood_parquet_oak',
    railing: {
      colorDiffuse: [0.85, 0.85, 0.85]
    }
  }
}

export function generateMeshes3d (a) {
  // settings for step ratio
  var stepRatioMax = 2.6,
    stepRatioMin = 1.15,

    // internals
    stepsVertices = [],
    svPos = 0,
    treadVertices = [],
    tvPos = 0,
    railingVertices = [],
    rvPos = 0,

    // internal settings
    handrailThickness = 0.02,
    stairWidth = a.w,
    stairLength = a.l,
    flipStair = a.circulation === 'left',
    stepWidth = a.stepWidth,
    stairWell = 0.3,
    nosing = 0.02,
    riserExt = a.stepThickness

  var aX, aY, aZ, bY, cX, cY, cZ, dY, eX, eY, eZ, fX, fZ, gZ, hX, hZ, // BASE
    kX, kY, kZ, lY, mX, mZ, oX, oZ, qX, qZ, // TREAD
    runA, runB, runC, // RUN
    stepNumber, calcRiser, tread, calcTread, stepsLength

  // STAIR Configurations

  if (a.stairType === 'straight') {
    // Straight

    // reset stairWidth
    a.w = stepWidth
    stepWidth = a.w
    a.circulation = 'right'

    if ((a.l/ a.h)<=stepRatioMin) a.l = a.h*stepRatioMin
    if ((a.l/ a.h)>=stepRatioMax) a.l = a.h*stepRatioMax
    stairLength = a.l
    calcTread = ((stairLength/a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stairLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stairLength/stepNumber

    runA = stepNumber

    _straightRun(0, 0, 0, runA, tread)

  } else if (a.stairType === 'straightLanding') {
    // Straight + Platform

    var platformLength = 1

    // reset stairWidth
    a.w = a.stepWidth
    stepWidth = a.w
    a.circulation = 'right'

    if (((a.l-platformLength) / a.h)<stepRatioMin) a.l = a.h*stepRatioMin + platformLength
    if (((a.l-platformLength) / a.h)>stepRatioMax) a.l = a.h*stepRatioMax + platformLength
    stepsLength = a.l-platformLength
    calcTread = ((stepsLength / a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stepsLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stepsLength/stepNumber

    runA = Math.ceil(stepNumber/2)
    runB = stepNumber - runA

    _straightRun(0, 0, 0, runA, tread)
    _platform(runA*tread, runA*calcRiser, 0, stepWidth, platformLength)
    _straightRun(runA*tread+platformLength, runA*calcRiser, 0, runB, tread)

  } else if (a.stairType === 'lShaped') {
    // L-Shaped

    if (a.w<stepWidth+0.3) a.w=stepWidth+0.3
    if (a.l<stepWidth+0.3) a.l=stepWidth+0.3
    stepsLength = a.l + a.w - (2*stepWidth)

    calcTread = ((stepsLength / a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stepsLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stepsLength/stepNumber

    runA = Math.floor((a.l-stepWidth)/tread)
    runB = stepNumber - runA

    if (!flipStair) {
      _straightRun(0, 0, 0, runA, (a.l-stepWidth)/runA)
      _platform(a.l-stepWidth, runA*calcRiser, 0, stepWidth, stepWidth)
      _straightRun(a.l, runA*calcRiser, stepWidth, runB, tread = (a.w-stepWidth)/runB, 90)
    } else {
      _straightRun(0, 0, a.w-stepWidth, runA, (a.l-stepWidth)/runA)
      _platform(a.l, runA*calcRiser, a.w-stepWidth, stepWidth, stepWidth, 90)
      _straightRun(a.l-stepWidth, runA*calcRiser, a.w-stepWidth, runB, tread = (a.w-stepWidth)/runB, -90)
    }

  } else if (a.stairType === 'halfLanding') {
    // Half Landing

    if (a.w<stepWidth*2+0.05) a.w=stepWidth*2+0.05
    stairWidth = a.w
    //stepsLength = (a.l-stepWidth)

    if (((a.l-stepWidth)*2 / a.h)<stepRatioMin) a.l = a.h/2*stepRatioMin + stepWidth
    if (((a.l-stepWidth)*2 / a.h)>stepRatioMax) a.l = a.h/2*stepRatioMax + stepWidth
    stepsLength = a.l-stepWidth

    calcTread = ((stepsLength / (a.h/2) + 1.2321)/0.10357)/100
    stepNumber = Math.round(stepsLength/calcTread)
    calcRiser = (a.h/2)/stepNumber
    tread = stepsLength/stepNumber

    runA = stepNumber
    runB = stepNumber
    if (!flipStair) {
      _straightRun(0, 0, 0, runA, tread)
      _platform(runA * tread, runA * calcRiser, 0, stairWidth, stepWidth)
      _straightRun(runA * tread, runA * calcRiser, stairWidth, runB, tread, 180)
    } else {
      _straightRun(0, 0, stairWidth - stepWidth, runA, tread)
      _platform(runA * tread, runA * calcRiser, 0, stairWidth, stepWidth)
      _straightRun(runA * tread, runA * calcRiser, stepWidth, runB, tread, 180)
    }

  } else if (a.stairType === '2QuarterLanding') {
    // 2 Quarter Landing

    if (a.w<stepWidth*2+0.3) a.w=stepWidth*2+0.3
    if (a.l<stepWidth+0.3) a.l=stepWidth+0.3
    stairWidth = a.w
    stepsLength = (a.l-stepWidth)*2+a.w-stepWidth*2

    calcTread = ((stepsLength / a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stepsLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stepsLength/stepNumber

    runA = Math.round((a.l-stepWidth)/tread)
    runC = runA
    runB = stepNumber - runA*2

    // maintain full Length by altering tread Length for runA & runC
    tread = (a.l-stepWidth)/runA

    // Workaround for misconfiguration
    if (runB < 1 && stairWidth > stepWidth * 2) {
      runB = 1
      runC = runC - 1
    }

    if (!flipStair) {
      _straightRun(0, 0, 0, runA, (a.l - stepWidth) / runA)
      _platform(a.l - stepWidth, runA * calcRiser, 0, stepWidth, stepWidth)
      _straightRun(a.l, runA * calcRiser, stepWidth, runB, (a.w - stepWidth * 2) / runB, 90)
      _platform(a.l, (runA + runB) * calcRiser, stairWidth - stepWidth, stepWidth, stepWidth, 90)
      _straightRun(runA * tread, (runA + runB) * calcRiser, stairWidth, runC, (a.l - stepWidth) / runA, 180)
    } else {
      _straightRun(0, 0, stairWidth - stepWidth, runA, (a.l - stepWidth) / runA)
      _platform(a.l - stepWidth, (runA + runB) * calcRiser, 0, stepWidth, stepWidth)
      _straightRun(a.l - stepWidth, runA * calcRiser, stairWidth - stepWidth, runB, (a.w - stepWidth * 2) / runB, -90)
      _platform(a.l, runA * calcRiser, stairWidth - stepWidth, stepWidth, stepWidth, 90)
      _straightRun(runA * tread, (runA + runB) * calcRiser, stepWidth, runC, (a.l - stepWidth) / runA, 180)
    }

  } else if (a.stairType === 'winder') {
    // Winder

    if (a.w<stepWidth+stairWell+0.5) a.w=stepWidth+stairWell+0.5
    if (a.l<stepWidth+stairWell+0.5) a.l=stepWidth+stairWell+0.5

    stepsLength = a.l + a.w - stepWidth
    calcTread = ((stepsLength / a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stepsLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stepsLength/stepNumber

    //console.log("Winder")
    runB = 2*Math.round((stepWidth/2+stairWell)/tread)
    runA = Math.round((a.l-stepWidth-stairWell)/tread)
    runC = stepNumber - runA - runB

    if (!flipStair) {
      _straightRun(0, 0, 0, runA, (a.l - stepWidth - stairWell) / runA)
      _winder(a.l - stepWidth - stairWell, runA * calcRiser, 0, runB)
      if (runC > 0) _straightRun(a.l, (runA + runB) * calcRiser, stepWidth + stairWell, runC, (a.w - stepWidth - stairWell) / runC, 90)
    } else {
      _straightRun(0, 0, a.w-stepWidth, runA, (a.l - stepWidth - stairWell) / runA)
      _winder(a.l - stepWidth - stairWell, runA * calcRiser, a.w-stepWidth, runB, 0, flipStair)
      if (runC > 0) _straightRun(a.l - stepWidth, (runA + runB) * calcRiser, a.w - stepWidth - stairWell, runC, (a.w - stepWidth - stairWell) / runC, -90)
    }

  } else if (a.stairType === 'doubleWinder') {
    // Double Winder

    if (a.w<(stepWidth+0.15)*2) a.w=(stepWidth+0.15)*2
    if (a.l<stepWidth+stairWell) a.l=stepWidth+stairWell

    stepsLength = a.l*2 + a.w - stepWidth*2
    calcTread = ((stepsLength / a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stepsLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stepsLength/stepNumber

    runB = 4*Math.round((stepWidth/2+stairWell)/tread)
    runC = Math.round((a.w-(stepWidth+stairWell)*2)/tread)
    runA = Math.round((stepNumber - runB - runC) / 2)

    if (runA < 1) {
      stairWell = a.l-stepWidth
      runA = 0
    }
    if (runC < 1) {
      stairWell = a.w/2-stepWidth
      runC = 0
    }

    if (!flipStair) {
      if (runA > 0) _straightRun(0, 0, 0, runA, (a.l - stepWidth - stairWell) / runA)
      _winder(a.l - stepWidth - stairWell, runA * calcRiser, 0, runB / 2)
      if (runC > 0) _straightRun(a.l, (runA + runB / 2) * calcRiser, stepWidth + stairWell, runC, (a.w - (stepWidth + stairWell) * 2) / runC, 90)
      _winder(a.l, (runA + runB / 2 + runC) * calcRiser, a.w - stepWidth - stairWell, runB / 2, 90)
      if (runA > 0) _straightRun(a.l - stepWidth - stairWell, (runA + runB + runC) * calcRiser, a.w, runA, (a.l - stepWidth - stairWell) / runA, 180)
    } else {
      if (runA > 0) _straightRun(0, 0, a.w - stepWidth, runA, (a.l - stepWidth - stairWell) / runA)
      _winder(a.l - stepWidth - stairWell, runA * calcRiser, a.w - stepWidth, runB / 2, 0, flipStair)
      if (runC > 0) _straightRun(a.l - stepWidth, (runA + runB / 2) * calcRiser, a.w - stepWidth - stairWell, runC, (a.w - (stepWidth + stairWell) * 2) / runC, -90)
      _winder(a.l - stepWidth, (runA + runB / 2 + runC) * calcRiser, stepWidth + stairWell, runB / 2, -90, flipStair)
      if (runA > 0) _straightRun(a.l - stepWidth - stairWell, (runA + runB + runC) * calcRiser, stepWidth, runA, (a.l - stepWidth - stairWell) / runA, 180)
    }

  } else if (a.stairType === 'spiral') {
    // Spiral

    stairWidth = a.w

    if (stairWidth < stepWidth) {
      stairWidth = stepWidth
      a.w = stepWidth
    }

    if ((a.l/ a.h)<=stepRatioMin) a.l = a.h*stepRatioMin
    if ((a.l/ a.h)>=stepRatioMax) a.l = a.h*stepRatioMax
    stairLength = a.l
    calcTread = ((stairLength/a.h + 1.2321)/0.10357)/100
    stepNumber = Math.round(stairLength/calcTread)
    calcRiser = a.h/stepNumber
    tread = stairLength/stepNumber

    runA = stepNumber

    _spiralRun(0, 0, 0, runA, flipStair)

  }

  // Geometry Generation Functions

  function _straightRun(xCursor, yCursor, zCursor, stepNumber, tread, angle) {
    ////// BASE
    var vs, ve, ts, te, rs, re, xRotate, i,
      offsetX = xCursor,
      offsetZ = zCursor

    vs = stepsVertices.length
    ts = treadVertices.length
    rs = railingVertices.length

    // Left Railing
    if (a.railing === 'left'||a.railing === 'both') _railing(xCursor, yCursor+calcRiser, zCursor+handrailThickness+0.01, xCursor+stepNumber*tread, yCursor+stepNumber*calcRiser+calcRiser, zCursor+handrailThickness+0.01)
    if (a.railing === 'right'||a.railing === 'both') _railing(xCursor, yCursor+calcRiser, zCursor+stepWidth-0.01, xCursor+stepNumber*tread, yCursor+stepNumber*calcRiser+calcRiser, zCursor+stepWidth-0.01)

    for (var k = 0; k < stepNumber; k++) {

      // F----I
      // |\   |\
      // G \  H \
      // |\ A----D
      // J \|    |
      //    B    C
      //    |  /
      //    E

      aX = xCursor
      aY = yCursor + calcRiser - a.treadHeight
      aZ = zCursor + stepWidth
      bY = yCursor
      cX = xCursor + tread
      cY = yCursor + calcRiser - riserExt
      cZ = aZ
      eY = yCursor - riserExt
      fX = aX
      fZ = zCursor
      hX = cX
      hZ = fZ

      _step(aX, aY, aZ, bY, cY, cX, cZ, eY, fX, fZ, hX, hZ)

      xCursor += tread
      yCursor += calcRiser
    }

    ve = stepsVertices.length
    te = treadVertices.length
    re = railingVertices.length

    if (angle) {

      var cosAngle = Math.cos(angle / 180 * Math.PI),
        sinAngle = Math.sin(angle / 180 * Math.PI)

      for (i=vs;i<ve-2; i = i + 3){
        xRotate=stepsVertices[i]-offsetX
        stepsVertices[i+2]=stepsVertices[i+2]-offsetZ
        stepsVertices[i]=xRotate*cosAngle-stepsVertices[i+2]*sinAngle+offsetX
        stepsVertices[i+2]=stepsVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
      }
      for (i=ts;i<te-2; i = i + 3){
        xRotate=treadVertices[i]-offsetX
        treadVertices[i+2]=treadVertices[i+2]-offsetZ
        treadVertices[i]=xRotate*cosAngle-treadVertices[i+2]*sinAngle+offsetX
        treadVertices[i+2]=treadVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
      }
      for (i=rs;i<re-2; i = i + 3){
        xRotate=railingVertices[i]-offsetX
        railingVertices[i+2]=railingVertices[i+2]-offsetZ
        railingVertices[i]=xRotate*cosAngle-railingVertices[i+2]*sinAngle+offsetX
        railingVertices[i+2]=railingVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
      }
    }

  }

  function _platform(xCursor, yCursor, zCursor, width, length, angle) {

    // F-------I
    // |\      |\
    // G \-----H \
    //  \ A-------D
    //   \|      \|
    //    B-------C

    var platformExt = length,
      vs, ve, ts, te, rs, re, xRotate, i,
      offsetX = xCursor,
      offsetZ = zCursor

    vs = stepsVertices.length
    ts = treadVertices.length
    rs = railingVertices.length

    aX = xCursor
    aY = yCursor - a.treadHeight
    aZ = zCursor+ width
    bY = yCursor - riserExt
    //cY = yCursor - riserExt
    cX = xCursor + platformExt
    eX = aX
    eY = yCursor - riserExt
    fZ = zCursor

    // Straight Platform Railing
    if (a.stairType === 'straightLanding') {
      if (a.railing === 'left'||a.railing === 'both') _railing(xCursor, yCursor+calcRiser, zCursor+handrailThickness+0.01, xCursor+length, yCursor+calcRiser, zCursor+handrailThickness+0.01)
      if (a.railing === 'right'||a.railing === 'both') _railing(xCursor, yCursor+calcRiser, zCursor+width-0.01, xCursor+length, yCursor+calcRiser, zCursor+width-0.01)
    }

    // L-Shape Platform Railing
    if (a.stairType === 'lShaped'||a.stairType === '2QuarterLanding') {
      if ((a.railing === 'left' && !flipStair) || (a.railing === 'right' && flipStair) || a.railing === 'both') {
        _railing(xCursor, yCursor+calcRiser, zCursor+handrailThickness+0.01, xCursor+length-handrailThickness-0.01, yCursor+calcRiser, zCursor+handrailThickness+0.01, 0, true)
        _railing(xCursor+length-handrailThickness-0.01, yCursor+calcRiser, zCursor+0.01, xCursor+length+width-handrailThickness-0.02, yCursor+calcRiser, zCursor+0.01, 90, true)
      }
    }

    // Half Landing Platform Railing
    if (a.stairType === 'halfLanding' ){
      if ((a.railing === 'left' && !flipStair) || (a.railing === 'right' && flipStair) || a.railing === 'both') {
        _railing(xCursor, yCursor+calcRiser, zCursor+handrailThickness+0.01, xCursor+length-handrailThickness-0.01, yCursor+calcRiser, zCursor+handrailThickness+0.01, 0, true)
        _railing(xCursor+length-handrailThickness-0.01, yCursor+calcRiser, zCursor+0.01, xCursor+length+width-handrailThickness*2-0.03, yCursor+calcRiser, zCursor+0.01, 90, true)
        _railing(xCursor+length-0.01, yCursor+calcRiser, zCursor+width-0.01-handrailThickness, xCursor+length+length-handrailThickness, yCursor+calcRiser, zCursor+width-0.01-handrailThickness, 180, true)
      }
      if ((a.railing === 'left' && flipStair) || (a.railing === 'right' && !flipStair) || a.railing === 'both') {
        _railing(xCursor, yCursor+calcRiser, zCursor+stepWidth-0.01-handrailThickness, xCursor+width-stepWidth*2+(0.01+handrailThickness)*2, yCursor+calcRiser, zCursor+stepWidth-0.01-handrailThickness, 90)
      }
    }

    // Platform Base

    if (a.stairType === 'halfLanding' && stairWell) {
      // FRONT
      //F
      stepsVertices[svPos] = stepsVertices[svPos + 9] = aX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = fZ + stepWidth
      //G
      stepsVertices[svPos + 3] = aX
      stepsVertices[svPos + 4] = bY
      stepsVertices[svPos + 5] = fZ + stepWidth
      //B
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = aZ - stepWidth
      //A
      stepsVertices[svPos + 15] = aX
      stepsVertices[svPos + 16] = aY
      stepsVertices[svPos + 17] = aZ - stepWidth

      svPos += 18
    }

    if (a.stairType === 'lShaped'||a.stairType === 'halfLanding' ||a.stairType === '2QuarterLanding') {
      // BACK
      //D
      stepsVertices[svPos] = stepsVertices[svPos + 9] = cX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = aZ
      //C
      stepsVertices[svPos + 3] = cX
      stepsVertices[svPos + 4] = bY
      stepsVertices[svPos + 5] = aZ
      //H
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = cX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = fZ
      //I
      stepsVertices[svPos + 15] = cX
      stepsVertices[svPos + 16] = aY
      stepsVertices[svPos + 17] = fZ

      svPos += 18
    }



    // RIGHT
    //A
    stepsVertices[svPos] = stepsVertices[svPos + 9] = aX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = aZ
    //B
    stepsVertices[svPos + 3] = aX
    stepsVertices[svPos + 4] = bY
    stepsVertices[svPos + 5] = aZ
    //C
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = cX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = aZ
    //D
    stepsVertices[svPos + 15] = cX
    stepsVertices[svPos + 16] = aY
    stepsVertices[svPos + 17] = aZ

    svPos += 18

    // LEFT
    //I
    stepsVertices[svPos] = stepsVertices[svPos + 9] = cX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = fZ
    //H
    stepsVertices[svPos + 3] = cX
    stepsVertices[svPos + 4] = bY
    stepsVertices[svPos + 5] = fZ
    //G
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = fZ
    //F
    stepsVertices[svPos + 15] = aX
    stepsVertices[svPos + 16] = aY
    stepsVertices[svPos + 17] = fZ

    svPos += 18

    // BOTTOM
    //C
    stepsVertices[svPos] = stepsVertices[svPos + 9] = cX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = bY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = aZ
    //B
    stepsVertices[svPos + 3] = aX
    stepsVertices[svPos + 4] = bY
    stepsVertices[svPos + 5] = aZ
    //G
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = fZ
    //H
    stepsVertices[svPos + 15] = cX
    stepsVertices[svPos + 16] = bY
    stepsVertices[svPos + 17] = fZ

    svPos += 18

    if (!a.treadHeight) {
      // TOP
      //A
      stepsVertices[svPos] = stepsVertices[svPos + 9] = aX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = aZ
      //D
      stepsVertices[svPos + 3] = cX
      stepsVertices[svPos + 4] = aY
      stepsVertices[svPos + 5] = aZ
      //I
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = cX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = aY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = fZ
      //F
      stepsVertices[svPos + 15] = aX
      stepsVertices[svPos + 16] = aY
      stepsVertices[svPos + 17] = fZ

      svPos += 18
    }
    if (a.treadHeight > 0) {

      // O----R
      // P\---Q\
      //  \\   \\
      //   \K----N
      //    L----M

      kX = aX
      kY = aY + a.treadHeight
      kZ = zCursor+ width
      lY = aY
      mX = aX + platformExt
      oZ = zCursor

      if (a.stairType === 'lShaped'||a.stairType === 'halfLanding' ||a.stairType === '2QuarterLanding') {

        // BACK
        //M
        treadVertices[tvPos] = treadVertices[tvPos + 9] = mX
        treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
        treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = kZ
        //N
        treadVertices[tvPos + 3] = mX
        treadVertices[tvPos + 4] = lY
        treadVertices[tvPos + 5] = kZ
        //Q
        treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = mX
        treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
        treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = oZ
        //R
        treadVertices[tvPos + 15] = mX
        treadVertices[tvPos + 16] = kY
        treadVertices[tvPos + 17] = oZ

        tvPos += 18
      }

      // TOP
      //R
      treadVertices[tvPos] = treadVertices[tvPos + 9] = mX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = oZ
      //O
      treadVertices[tvPos + 3] = kX
      treadVertices[tvPos + 4] = kY
      treadVertices[tvPos + 5] = oZ
      //K
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = kX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = kY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = kZ
      //N
      treadVertices[tvPos + 15] = mX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = kZ

      tvPos += 18
      // RIGHT
      //K
      treadVertices[tvPos] = treadVertices[tvPos + 9] = kX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = kZ
      //L
      treadVertices[tvPos + 3] = kX
      treadVertices[tvPos + 4] = lY
      treadVertices[tvPos + 5] = kZ
      //M
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = mX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = kZ
      //N
      treadVertices[tvPos + 15] = mX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = kZ

      tvPos += 18
      // FRONT
      //O
      treadVertices[tvPos] = treadVertices[tvPos + 9] = kX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = oZ
      //P
      treadVertices[tvPos + 3] = kX
      treadVertices[tvPos + 4] = lY
      treadVertices[tvPos + 5] = oZ
      //L
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = kX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = kZ
      //K
      treadVertices[tvPos + 15] = kX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = kZ

      tvPos += 18

      // LEFT
      //R
      treadVertices[tvPos] = treadVertices[tvPos + 9] = mX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = oZ
      //Q
      treadVertices[tvPos + 3] = mX
      treadVertices[tvPos + 4] = lY
      treadVertices[tvPos + 5] = oZ
      //P
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = kX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = oZ
      //O
      treadVertices[tvPos + 15] = kX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = oZ

      tvPos += 18
      // Show Back and Bottom Face if Stair is not massive
      /*
       if (a.construction !== 0) {

       // BACK
       //N
       treadVertices[tvPos] = treadVertices[tvPos + 9] = mX
       treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
       treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = kZ
       //M
       treadVertices[tvPos + 3] = mX
       treadVertices[tvPos + 4] = lY
       treadVertices[tvPos + 5] = kZ
       //Q
       treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = mX
       treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
       treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = oZ
       //R
       treadVertices[tvPos + 15] = mX
       treadVertices[tvPos + 16] = kY
       treadVertices[tvPos + 17] = oZ

       tvPos += 18

       // BOTTOM
       //M
       treadVertices[tvPos] = treadVertices[tvPos + 9] = mX
       treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = lY
       treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = kZ
       //L
       treadVertices[tvPos + 3] = kX
       treadVertices[tvPos + 4] = lY
       treadVertices[tvPos + 5] = kZ
       //P
       treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = kX
       treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
       treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = oZ
       //Q
       treadVertices[tvPos + 15] = mX
       treadVertices[tvPos + 16] = lY
       treadVertices[tvPos + 17] = oZ

       tvPos += 18
       } */

      ve = stepsVertices.length
      te = treadVertices.length
      re = railingVertices.length

      if (angle) {
        var cosAngle = Math.cos(angle / 180 * Math.PI),
          sinAngle = Math.sin(angle / 180 * Math.PI)

        for (i=vs;i<ve-2; i = i + 3){
          xRotate=stepsVertices[i]-offsetX
          stepsVertices[i+2]=stepsVertices[i+2]-offsetZ
          stepsVertices[i]=xRotate*cosAngle-stepsVertices[i+2]*sinAngle+offsetX
          stepsVertices[i+2]=stepsVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
        }
        for (i=ts;i<te-2; i = i + 3){
          xRotate=treadVertices[i]-offsetX
          treadVertices[i+2]=treadVertices[i+2]-offsetZ
          treadVertices[i]=xRotate*cosAngle-treadVertices[i+2]*sinAngle+offsetX
          treadVertices[i+2]=treadVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
        }
        for (i=rs;i<re-2; i = i + 3){
          xRotate=railingVertices[i]-offsetX
          railingVertices[i+2]=railingVertices[i+2]-offsetZ
          railingVertices[i]=xRotate*cosAngle-railingVertices[i+2]*sinAngle+offsetX
          railingVertices[i+2]=railingVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
        }
      }
    }
  }

  function _step(aX, aY, aZ, bY, cY, cX, cZ, eY, fX, fZ, hX, hZ) {
    // F----I
    // |\   |\
    // G \  H \
    // L\ A----D
    // J \|    |
    //    B    C
    //    K  /
    //    E

    ///// BASE

    // add extra face to create a watertight mesh
    var kY = bY - a.treadHeight

    if (aY >= a.h-calcRiser) {
      // BACK > LAST STEP

      //D
      stepsVertices[svPos] = stepsVertices[svPos + 9] = cX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = cZ
      //C
      stepsVertices[svPos + 3] = cX
      stepsVertices[svPos + 4] = cY
      stepsVertices[svPos + 5] = cZ
      //H
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = hX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = cY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = hZ
      //I
      stepsVertices[svPos + 15] = hX
      stepsVertices[svPos + 16] = aY
      stepsVertices[svPos + 17] = hZ

      svPos += 18
    }

    if (!a.treadHeight) {
      // TOP

      //I
      stepsVertices[svPos] = stepsVertices[svPos + 9] = hX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = hZ
      //F
      stepsVertices[svPos + 3] = fX
      stepsVertices[svPos + 4] = aY
      stepsVertices[svPos + 5] = fZ
      //A
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = aY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = aZ
      //D
      stepsVertices[svPos + 15] = cX
      stepsVertices[svPos + 16] = aY
      stepsVertices[svPos + 17] = cZ

      svPos += 18
    }

    // SIDE RIGHT
    //A
    stepsVertices[svPos] = stepsVertices[svPos + 9] = aX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = aZ
    //B
    stepsVertices[svPos + 3] = aX
    stepsVertices[svPos + 4] = bY
    stepsVertices[svPos + 5] = aZ
    //C
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = cX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = cY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = cZ
    //D
    stepsVertices[svPos + 15] = cX
    stepsVertices[svPos + 16] = aY
    stepsVertices[svPos + 17] = cZ

    svPos += 18

    if (bY === kY) {
      //B
      stepsVertices[svPos] = aX
      stepsVertices[svPos + 1] = bY
      stepsVertices[svPos + 2] = aZ
      //E
      stepsVertices[svPos + 3] = aX
      stepsVertices[svPos + 4] = eY
      stepsVertices[svPos + 5] = aZ
      //C
      stepsVertices[svPos + 6] = cX
      stepsVertices[svPos + 7] = cY
      stepsVertices[svPos + 8] = cZ

      svPos += 9
    } else {
      //C
      stepsVertices[svPos] = stepsVertices[svPos + 9] = cX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = cY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = cZ
      //B
      stepsVertices[svPos + 3] = aX
      stepsVertices[svPos + 4] = bY
      stepsVertices[svPos + 5] = aZ
      //K
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = kY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = aZ
      //E
      stepsVertices[svPos + 15] = aX
      stepsVertices[svPos + 16] = eY
      stepsVertices[svPos + 17] = aZ

      svPos += 18
    }

    //Front
    //F
    stepsVertices[svPos] = stepsVertices[svPos + 9] = fX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = fZ
    //G
    stepsVertices[svPos + 3] = fX
    stepsVertices[svPos + 4] = bY
    stepsVertices[svPos + 5] = fZ
    //B
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = aZ
    //A
    stepsVertices[svPos + 15] = aX
    stepsVertices[svPos + 16] = aY
    stepsVertices[svPos + 17] = aZ

    svPos += 18

    //SIDE LEFT
    //I
    stepsVertices[svPos] = stepsVertices[svPos + 9] = hX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = aY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = hZ
    //H
    stepsVertices[svPos + 3] = hX
    stepsVertices[svPos + 4] = cY
    stepsVertices[svPos + 5] = hZ
    //G
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = fX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = bY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = fZ
    //F
    stepsVertices[svPos + 15] = fX
    stepsVertices[svPos + 16] = aY
    stepsVertices[svPos + 17] = fZ

    svPos += 18

    if (bY === kY) {
      //H
      stepsVertices[svPos] = hX
      stepsVertices[svPos + 1] = cY
      stepsVertices[svPos + 2] = hZ
      //J
      stepsVertices[svPos + 3] = fX
      stepsVertices[svPos + 4] = eY
      stepsVertices[svPos + 5] = fZ
      //G
      stepsVertices[svPos + 6] = fX
      stepsVertices[svPos + 7] = bY
      stepsVertices[svPos + 8] = fZ

      svPos += 9
    } else {
      //H
      stepsVertices[svPos] = stepsVertices[svPos + 9] = hX
      stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = cY
      stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = hZ
      //J
      stepsVertices[svPos + 3] = fX
      stepsVertices[svPos + 4] = eY
      stepsVertices[svPos + 5] = fZ
      //L
      stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = fX
      stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = kY
      stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = fZ
      //G
      stepsVertices[svPos + 15] = fX
      stepsVertices[svPos + 16] = bY
      stepsVertices[svPos + 17] = fZ

      svPos += 18
    }

    // BOTTOM

    //H
    stepsVertices[svPos] = stepsVertices[svPos + 9] = hX
    stepsVertices[svPos + 1] = stepsVertices[svPos + 10] = cY
    stepsVertices[svPos + 2] = stepsVertices[svPos + 11] = hZ
    //C
    stepsVertices[svPos + 3] = cX
    stepsVertices[svPos + 4] = cY
    stepsVertices[svPos + 5] = cZ
    //E
    stepsVertices[svPos + 6] = stepsVertices[svPos + 12] = aX
    stepsVertices[svPos + 7] = stepsVertices[svPos + 13] = eY
    stepsVertices[svPos + 8] = stepsVertices[svPos + 14] = aZ
    //J
    stepsVertices[svPos + 15] = fX
    stepsVertices[svPos + 16] = eY
    stepsVertices[svPos + 17] = fZ

    svPos += 18

    if (a.treadHeight) {
      // TREAD

      // O----R
      // P\---Q\
      //  \\   \\
      //   \K----N
      //    L----M

      kX = aX - nosing
      kY = aY + a.treadHeight
      kZ = aZ
      lY = aY
      mX = cX
      mZ = cZ
      oX = fX - nosing
      oZ = fZ
      qX = hX
      qZ = hZ

      if (kX!==oX&&kZ!==oZ) {
        var radAngle = Math.atan2(kZ - oZ, kX-oX);
        var degAngle = Math.round(radAngle * 180 / Math.PI * 100)/100;
        if (a.stairType === 'winder' || a.stairType === 'doubleWinder' ){
          if (degAngle >= 135) {
            kX = aX
            kZ = aZ - nosing
            oX = fX
            oZ = fZ - nosing
          }
          if (degAngle <= 45 ) { //>= 45 && degAngle < 90) {
            kX = aX
            kZ = aZ + nosing
            oX = fX
            oZ = fZ + nosing
          }
        } else if (a.stairType === 'spiral') {
          kX = aX - nosing*Math.cos(radAngle-Math.PI/2)
          kZ = aZ - nosing*Math.sin(radAngle-Math.PI/2)
          oX = fX - nosing*Math.cos(radAngle-Math.PI/2)
          oZ = fZ - nosing*Math.sin(radAngle-Math.PI/2)
        }
      }

      if (aY >= a.h-calcRiser) {
        // BACK > LAST STEP

        //N
        treadVertices[tvPos] = treadVertices[tvPos + 9] = mX
        treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
        treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = mZ
        //M
        treadVertices[tvPos + 3] = mX
        treadVertices[tvPos + 4] = lY
        treadVertices[tvPos + 5] = mZ
        //Q
        treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = qX
        treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
        treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = qZ
        //R
        treadVertices[tvPos + 15] = qX
        treadVertices[tvPos + 16] = kY
        treadVertices[tvPos + 17] = qZ

        tvPos += 18
      }

      // TOP
      //R
      treadVertices[tvPos] = treadVertices[tvPos + 9] = qX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = qZ
      //O
      treadVertices[tvPos + 3] = oX
      treadVertices[tvPos + 4] = kY
      treadVertices[tvPos + 5] = oZ
      //K
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = kX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = kY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = kZ
      //N
      treadVertices[tvPos + 15] = mX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = mZ

      tvPos += 18
      // RIGHT
      //K
      treadVertices[tvPos] = treadVertices[tvPos + 9] = kX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = kZ
      //L
      treadVertices[tvPos + 3] = kX
      treadVertices[tvPos + 4] = lY
      treadVertices[tvPos + 5] = kZ
      //M
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = mX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = mZ
      //N
      treadVertices[tvPos + 15] = mX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = mZ

      tvPos += 18
      // FRONT
      //O
      treadVertices[tvPos] = treadVertices[tvPos + 9] = oX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = oZ
      //P
      treadVertices[tvPos + 3] = oX
      treadVertices[tvPos + 4] = lY
      treadVertices[tvPos + 5] = oZ
      //L
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = kX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = kZ
      //K
      treadVertices[tvPos + 15] = kX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = kZ

      tvPos += 18

      // LEFT
      //R
      treadVertices[tvPos] = treadVertices[tvPos + 9] = qX
      treadVertices[tvPos + 1] = treadVertices[tvPos + 10] = kY
      treadVertices[tvPos + 2] = treadVertices[tvPos + 11] = qZ
      //Q
      treadVertices[tvPos + 3] = qX
      treadVertices[tvPos + 4] = lY
      treadVertices[tvPos + 5] = qZ
      //P
      treadVertices[tvPos + 6] = treadVertices[tvPos + 12] = oX
      treadVertices[tvPos + 7] = treadVertices[tvPos + 13] = lY
      treadVertices[tvPos + 8] = treadVertices[tvPos + 14] = oZ
      //O
      treadVertices[tvPos + 15] = oX
      treadVertices[tvPos + 16] = kY
      treadVertices[tvPos + 17] = oZ

      tvPos += 18

    }
  }

  function _winder(xCursor, yCursor, zCursor, stepNumber, angle, flip) {

    var vs, ve, ts, te, rs, re, xRotate, i,
      offsetX = xCursor,
      offsetZ = zCursor

    vs = stepsVertices.length
    ts = treadVertices.length
    rs = railingVertices.length

    var winderOffset = stairWell

    var treadWinderNum = stepNumber/2

    var treadWinderMax = (stepWidth+winderOffset)/treadWinderNum
    var treadWinderMin = winderOffset/treadWinderNum

    var stepMin = 0
    var stepMax = 0

    // Railing adapted to stair direction
    if (!flip) {
      if (a.railing === 'left' || a.railing === 'both') _railing(xCursor, yCursor + calcRiser, zCursor + handrailThickness + 0.01, xCursor + treadWinderNum * treadWinderMax - 0.01, yCursor + treadWinderNum * calcRiser + calcRiser, zCursor + handrailThickness + 0.01, 0, true)
      if (a.railing === 'right' || a.railing === 'both') _railing(xCursor, yCursor + calcRiser, zCursor + stepWidth - 0.01, xCursor + treadWinderNum * treadWinderMin, yCursor + treadWinderNum * calcRiser + calcRiser, zCursor + stepWidth - 0.01, 0, true)
    } else {
      if (a.railing === 'left' || a.railing === 'both') _railing(xCursor, yCursor + calcRiser, zCursor + handrailThickness + 0.01, xCursor + treadWinderNum * treadWinderMin, yCursor + treadWinderNum * calcRiser + calcRiser, zCursor + handrailThickness + 0.01, 0, true)
      if (a.railing === 'right' || a.railing === 'both') _railing(xCursor, yCursor + calcRiser, zCursor + stepWidth - 0.01, xCursor + treadWinderNum * treadWinderMax - 0.01, yCursor + treadWinderNum * calcRiser + calcRiser, zCursor + stepWidth - 0.01, 0, true)
    }

    for (var c=0; c<treadWinderNum; c++){

      // F----I
      // |\   |\
      // G \  H \
      // |\ A----D
      // J \|    |
      //    B    C
      //    |  /
      //    E

      aX = flip ? xCursor + stepMax : xCursor + stepMin
      aY = yCursor + calcRiser - a.treadHeight
      aZ = zCursor + stepWidth
      bY = yCursor
      cY = yCursor + calcRiser - riserExt
      cX = flip ? xCursor + stepMax + treadWinderMax : xCursor + stepMin + treadWinderMin
      cZ = aZ
      fX = flip ? xCursor + stepMin : xCursor + stepMax
      eY = yCursor - riserExt
      fZ = zCursor
      hX = flip ? xCursor + stepMin + treadWinderMin : xCursor + stepMax + treadWinderMax
      hZ = fZ

      _step(aX, aY, aZ, bY, cY, cX, cZ, eY, fX, fZ, hX, hZ)

      yCursor += calcRiser
      stepMin += treadWinderMin
      stepMax += treadWinderMax

    }
    xCursor += stepMin

    stepMin = 0
    stepMax = 0

    // Railing adapted to stair direction
    if (!flip) {
      if (a.railing === 'left'||a.railing === 'both') _railing(offsetX+treadWinderNum*treadWinderMax-handrailThickness-0.01, yCursor+calcRiser, zCursor+0.01, offsetX+treadWinderNum*treadWinderMax*2-handrailThickness-0.01, yCursor+treadWinderNum*calcRiser+calcRiser, zCursor+0.01, 90, true)
      if (a.railing === 'right'||a.railing === 'both') _railing(xCursor+0.01, yCursor+calcRiser, zCursor+stepWidth-0.01, xCursor+treadWinderNum*treadWinderMin+0.01, yCursor+treadWinderNum*calcRiser+calcRiser, zCursor+stepWidth-0.01, 90, true)
    } else {
      if (a.railing === 'left'||a.railing === 'both') _railing(xCursor+0.01, yCursor+calcRiser, zCursor+0.01, xCursor+treadWinderNum*treadWinderMin+0.01, yCursor+treadWinderNum*calcRiser+calcRiser, zCursor+0.01, -90, true)
      if (a.railing === 'right'||a.railing === 'both') _railing(offsetX+treadWinderNum*treadWinderMax-handrailThickness-0.01, yCursor+calcRiser, zCursor+stepWidth-0.01, offsetX+treadWinderNum*treadWinderMax*2-handrailThickness-0.01, yCursor+treadWinderNum*calcRiser+calcRiser, zCursor+stepWidth-0.01, -90, true)
    }

    for (var c=0; c<treadWinderNum; c++){

      // F----I
      // |\   |\
      // G \  H \
      // |\ A----D
      // J \|    |
      //    B    C
      //    |  /
      //    E

      if (!flip) {
        aX = xCursor
        aY = yCursor + calcRiser - a.treadHeight
        aZ = zCursor + stepWidth + stepMin
        bY = yCursor
        cY = yCursor + calcRiser - riserExt
        cX = aX
        cZ = aZ + treadWinderMin
        eY = yCursor - riserExt
        fX = xCursor + stepWidth
        fZ = zCursor + stepMax
        hX = fX
        hZ = zCursor + stepMax + treadWinderMax
      } else {
        aX = xCursor + stepWidth
        aY = yCursor + calcRiser - a.treadHeight
        aZ = zCursor + stepWidth - stepMax
        bY = yCursor
        cY = yCursor + calcRiser - riserExt
        cX = aX
        cZ = aZ - treadWinderMax
        eY = yCursor - riserExt
        fX = xCursor
        fZ = zCursor - stepMin
        hX = fX
        hZ = fZ - treadWinderMin
      }

      _step(aX, aY, aZ, bY, cY, cX, cZ, eY, fX, fZ, hX, hZ)

      yCursor += calcRiser
      stepMin += treadWinderMin
      stepMax += treadWinderMax

    }

    ve = stepsVertices.length
    te = treadVertices.length
    re = railingVertices.length

    if (angle) {
      var cosAngle = Math.cos(angle / 180 * Math.PI),
        sinAngle = Math.sin(angle / 180 * Math.PI)

      for (i=vs;i<ve-2; i = i + 3){
        xRotate=stepsVertices[i]-offsetX
        stepsVertices[i+2]=stepsVertices[i+2]-offsetZ
        stepsVertices[i]=xRotate*cosAngle-stepsVertices[i+2]*sinAngle+offsetX
        stepsVertices[i+2]=stepsVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
      }
      for (i=ts;i<te-2; i = i + 3){
        xRotate=treadVertices[i]-offsetX
        treadVertices[i+2]=treadVertices[i+2]-offsetZ
        treadVertices[i]=xRotate*cosAngle-treadVertices[i+2]*sinAngle+offsetX
        treadVertices[i+2]=treadVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
      }
      for (i=rs;i<re-2; i = i + 3){
        xRotate=railingVertices[i]-offsetX
        railingVertices[i+2]=railingVertices[i+2]-offsetZ
        railingVertices[i]=xRotate*cosAngle-railingVertices[i+2]*sinAngle+offsetX
        railingVertices[i+2]=railingVertices[i+2]*cosAngle+xRotate*sinAngle+offsetZ
      }
    }

  }

  function _spiralRun(xCursor, yCursor, zCursor, stepNumber, flip) {

    var innerRadius = stairWidth-stepWidth

    var stepAngle = tread / (innerRadius+stepWidth/2)
    var rotAngle = 0

    var outerStepDist = Math.sqrt(Math.pow((Math.sin(rotAngle)*(innerRadius+stepWidth)-Math.sin(rotAngle+stepAngle)*(innerRadius+stepWidth)), 2)+Math.pow((Math.cos(rotAngle)*(innerRadius+stepWidth)-Math.cos(rotAngle+stepAngle)*(innerRadius+stepWidth)), 2))
    var innerStepDist = Math.sqrt(Math.pow((Math.sin(rotAngle)*(innerRadius)-Math.sin(rotAngle+stepAngle)*(innerRadius)), 2)+Math.pow((Math.cos(rotAngle)*(innerRadius)-Math.cos(rotAngle+stepAngle)*(innerRadius)), 2))

    if (!flip) {
      rotAngle = Math.PI
      stepAngle = -stepAngle
      zCursor = zCursor + stairWidth
    }

    for (var c=0; c<stepNumber; c++){

      // F----I
      // |\   |\
      // G \  H \
      // |\ A----D
      // J \|    |
      //    B    C
      //    |  /
      //    E
      if (flip) {
        aX = xCursor + Math.sin(rotAngle) * (innerRadius + stepWidth)
        aY = yCursor + calcRiser - a.treadHeight
        aZ = zCursor + Math.cos(rotAngle) * (innerRadius + stepWidth)
        bY = yCursor
        cY = yCursor + calcRiser - riserExt
        cX = xCursor + Math.sin(rotAngle + stepAngle) * (innerRadius + stepWidth)
        cZ = zCursor + Math.cos(rotAngle + stepAngle) * (innerRadius + stepWidth)
        eY = yCursor - riserExt
        fX = xCursor + Math.sin(rotAngle) * (innerRadius)
        fZ = zCursor + Math.cos(rotAngle) * (innerRadius)
        hX = xCursor + Math.sin(rotAngle + stepAngle) * (innerRadius)
        hZ = zCursor + Math.cos(rotAngle + stepAngle) * (innerRadius)
      } else {
        aX = xCursor + Math.sin(rotAngle) * (innerRadius)
        aY = yCursor + calcRiser - a.treadHeight
        aZ = zCursor + Math.cos(rotAngle) * (innerRadius)
        bY = yCursor
        cY = yCursor + calcRiser - riserExt
        cX = xCursor + Math.sin(rotAngle + stepAngle) * (innerRadius)
        cZ = zCursor + Math.cos(rotAngle + stepAngle) * (innerRadius)
        eY = yCursor - riserExt
        fX = xCursor + Math.sin(rotAngle) * (innerRadius + stepWidth)
        fZ = zCursor + Math.cos(rotAngle) * (innerRadius + stepWidth)
        hX = xCursor + Math.sin(rotAngle + stepAngle) * (innerRadius + stepWidth)
        hZ = zCursor + Math.cos(rotAngle + stepAngle) * (innerRadius + stepWidth)
      }

      //var outerStepDist = Math.sqrt((aX-cX)*(aX-cX)+(aZ-cZ)*(aZ-cZ))

      _step(aX, aY, aZ, bY, cY, cX, cZ, eY, fX, fZ, hX, hZ)

      var openEnd = c<stepNumber-1
      var railingAngle = flip ? (rotAngle+stepAngle/2)/Math.PI*(-180) : (rotAngle+stepAngle/2)/Math.PI*(-180)+180
      if (flip) {
        if (stepWidth < stairWidth) {
          if (a.railing === 'left' || a.railing === 'both') _railing(fX, yCursor + calcRiser, fZ, fX + innerStepDist, yCursor + calcRiser * 2, fZ, railingAngle, openEnd)
        }
        if (a.railing === 'right'||a.railing === 'both') _railing(aX, yCursor+calcRiser, aZ, aX+outerStepDist, yCursor+calcRiser*2, aZ, railingAngle , openEnd)
      } else {
        if (a.railing === 'left' || a.railing === 'both') _railing(fX, yCursor + calcRiser, fZ, fX + outerStepDist, yCursor + calcRiser * 2, fZ, railingAngle, openEnd)
        if (stepWidth < stairWidth) {
          if (a.railing === 'right'||a.railing === 'both') _railing(aX, yCursor+calcRiser, aZ, aX+innerStepDist, yCursor+calcRiser*2, aZ, railingAngle , openEnd)
        }
      }

      yCursor += calcRiser
      rotAngle += stepAngle


    }

  }

  function _railing(x1, y1, z1, x2, y2, z2, angle, openEnd){

    var i, xCursor, yCursor, zCursor, handrailNum, handrailStep, handrailHeight, handrailStart, railingHeight ,vertBarDist, pailing, vertBarHeight, vertBarStart, rs, re, xRotate,
      aX, aY, aZ, bY, cX, cY, cZ, dY, eZ, fZ, gZ

    rs = railingVertices.length
    railingHeight = 0.9

    // calculate height for inclined Handrail

    var t = handrailThickness * (y2-y1) / Math.abs(x2-x1),
      calcHandrailThickness = Math.sqrt(handrailThickness * handrailThickness + t*t)

    //'Vertical Bars': 1,
    //'Horizontal Bars': 2,
    //'Filling': 3,
    //'Handrail only': 4

    if (a.railingType === 'verticalBars') {
      handrailNum = 2
      handrailStart = 0.05
      handrailStep = railingHeight-handrailStart
      vertBarHeight = railingHeight-handrailStart
      vertBarDist = 0.12
      vertBarStart = handrailStart
      pailing = 0.02
    }
    else if (a.railingType === 'horizontalBars') {
      handrailNum = 4
      handrailStart = 0.05
      handrailStep = (railingHeight-handrailStart)/handrailNum
      vertBarDist = 0.9
      vertBarHeight = railingHeight
      vertBarStart = 0
      pailing = 0.02
    }
    else if (a.railingType === 'filling') {
      handrailNum = 1
      handrailStart = 0.05
      handrailHeight = railingHeight-handrailStart
      vertBarDist = 0.9
      vertBarHeight = handrailStart
      vertBarStart = 0
      pailing = 0.02
    }
    else if (a.railingType === 'handrailOnly') {
      handrailNum = 1
      handrailStart = railingHeight
      vertBarDist = 0.9
      vertBarHeight = railingHeight
      vertBarStart = 0
      pailing = 0.02
    }

    // Vertical Bars

    if (a.railingType !== 'filling') {
      var handrailLength = openEnd ? Math.abs(x2-x1-pailing)+handrailThickness : Math.abs(x2-x1-pailing),
        segments = Math.floor(handrailLength/vertBarDist),
        xStep = handrailLength/segments,
        yStep = (y2-y1)/segments

      segments = openEnd&&segments>1 ? segments - 1 : segments


      // FRONT VIEW VERTICES
      //   E-----G
      //  /|    /|
      // A-----C |
      // | |   | |
      // | F---|-H
      // |/    |/
      // B-----D


      xCursor = x1
      yCursor = y1
      zCursor = z1

      for(i=0; i<=segments; i++) {

        aX = xCursor
        aY = yCursor+vertBarStart+vertBarHeight
        aZ = zCursor
        bY = a.railingType !== 'verticalBars' ? yCursor+vertBarStart-calcRiser : yCursor+vertBarStart+calcHandrailThickness
        cX = xCursor + pailing
        cY = aY + t
        dY = bY + t
        fZ = zCursor - pailing

        //FRONT
        //A
        railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
        railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
        railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
        //B
        railingVertices[rvPos + 3] = aX
        railingVertices[rvPos + 4] = bY
        railingVertices[rvPos + 5] = aZ
        //D
        railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
        railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = dY
        railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
        //C
        railingVertices[rvPos + 15] = cX
        railingVertices[rvPos + 16] = cY
        railingVertices[rvPos + 17] = aZ

        rvPos = rvPos + 18

        //LEFT
        //E
        railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
        railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
        railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = fZ
        //F
        railingVertices[rvPos + 3] = aX
        railingVertices[rvPos + 4] = bY
        railingVertices[rvPos + 5] = fZ
        //B
        railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
        railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
        railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
        //A
        railingVertices[rvPos + 15] = aX
        railingVertices[rvPos + 16] = aY
        railingVertices[rvPos + 17] = aZ

        rvPos = rvPos + 18

        //RIGHT
        //C
        railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
        railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = cY
        railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
        //D
        railingVertices[rvPos + 3] = cX
        railingVertices[rvPos + 4] = dY
        railingVertices[rvPos + 5] = aZ
        //H
        railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
        railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = dY
        railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = fZ
        //G
        railingVertices[rvPos + 15] = cX
        railingVertices[rvPos + 16] = cY
        railingVertices[rvPos + 17] = fZ

        rvPos = rvPos + 18

        //BACK
        //G
        railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
        railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = cY
        railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = fZ
        //H
        railingVertices[rvPos + 3] = cX
        railingVertices[rvPos + 4] = dY
        railingVertices[rvPos + 5] = fZ
        //F
        railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
        railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
        railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = fZ
        //E
        railingVertices[rvPos + 15] = aX
        railingVertices[rvPos + 16] = aY
        railingVertices[rvPos + 17] = fZ

        rvPos = rvPos + 18

        xCursor += xStep
        yCursor += yStep
      }
    }

    yCursor = handrailStart

    for(i=0; i<handrailNum; i++) {
      // FRONT VIEW VERTICES
      //   E----------G
      //  /|         /|
      // A----------C |
      // | F--------|-H
      // |/         |/
      // B----------D

      aX = x1
      aY = a.railingType === 'filling' ? yCursor+y1+handrailHeight : yCursor+y1+calcHandrailThickness
      aZ = z1
      bY = yCursor+y1
      cX = x2
      cY = a.railingType === 'filling' ? yCursor+y2+handrailHeight : yCursor+y2+calcHandrailThickness
      cZ = z2
      dY = yCursor+y2
      gZ = z2 - handrailThickness
      eZ = z1 - handrailThickness

      //TOP
      //E
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
      //A
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = aY
      railingVertices[rvPos + 5] = aZ
      //C
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = cY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = cZ
      //G
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = cY
      railingVertices[rvPos + 17] = gZ

      rvPos = rvPos + 18

      //BOTTOM
      //B
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = bY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
      //F
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = eZ
      //H
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = dY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = gZ
      //D
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = cY
      railingVertices[rvPos + 17] = cZ

      rvPos = rvPos + 18

      //FRONT
      //A
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = aZ
      //B
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = aZ
      //D
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = dY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = cZ
      //C
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = cY
      railingVertices[rvPos + 17] = cZ

      rvPos = rvPos + 18

      //LEFT
      //E
      railingVertices[rvPos] = railingVertices[rvPos + 9] = aX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = aY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = eZ
      //F
      railingVertices[rvPos + 3] = aX
      railingVertices[rvPos + 4] = bY
      railingVertices[rvPos + 5] = eZ
      //B
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = aZ
      //A
      railingVertices[rvPos + 15] = aX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = aZ

      rvPos = rvPos + 18

      //RIGHT
      //C
      railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = cY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = cZ
      //D
      railingVertices[rvPos + 3] = cX
      railingVertices[rvPos + 4] = dY
      railingVertices[rvPos + 5] = cZ
      //H
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = cX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = dY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = gZ
      //G
      railingVertices[rvPos + 15] = cX
      railingVertices[rvPos + 16] = cY
      railingVertices[rvPos + 17] = gZ

      rvPos = rvPos + 18

      //BACK
      //G
      railingVertices[rvPos] = railingVertices[rvPos + 9] = cX
      railingVertices[rvPos + 1] = railingVertices[rvPos + 10] = cY
      railingVertices[rvPos + 2] = railingVertices[rvPos + 11] = gZ
      //H
      railingVertices[rvPos + 3] = cX
      railingVertices[rvPos + 4] = dY
      railingVertices[rvPos + 5] = gZ
      //F
      railingVertices[rvPos + 6] = railingVertices[rvPos + 12] = aX
      railingVertices[rvPos + 7] = railingVertices[rvPos + 13] = bY
      railingVertices[rvPos + 8] = railingVertices[rvPos + 14] = eZ
      //E
      railingVertices[rvPos + 15] = aX
      railingVertices[rvPos + 16] = aY
      railingVertices[rvPos + 17] = eZ

      rvPos = rvPos + 18

      yCursor += handrailStep
    }

    re = railingVertices.length

    if (angle) {
      var cosAngle = Math.cos(angle / 180 * Math.PI),
        sinAngle = Math.sin(angle / 180 * Math.PI)

      for (i=rs;i<re-2; i = i + 3){
        xRotate=railingVertices[i]-x1
        railingVertices[i+2]=railingVertices[i+2]-z1
        railingVertices[i]=xRotate*cosAngle-railingVertices[i+2]*sinAngle+x1
        railingVertices[i+2]=railingVertices[i+2]*cosAngle+xRotate*sinAngle+z1
      }
    }
  }

  return Promise.resolve( {
    steps: {
      positions: new Float32Array(stepsVertices),
      normals: generateNormals.flat(stepsVertices),
      uvs: generateUvs.architectural(stepsVertices),
      material: 'steps'
    },
    tread: {
      positions: new Float32Array(treadVertices),
      normals: generateNormals.flat(treadVertices),
      uvs: generateUvs.architectural(treadVertices),
      material: 'tread'
    },
    railing: {
      positions: new Float32Array(railingVertices),
      normals: generateNormals.flat(railingVertices),
      material: 'railing'
    }
  })
}
