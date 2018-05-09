'use strict';

import cloneDeep from 'lodash/cloneDeep'
import poll from '../../utils/poll'
import getFromStorage from '../../storage/get'
import getDefaultsByType from './validate/get-defaults-by-type'
import paramGeneratorsMap from './parametric-objects/common/all'
import getData3dFromKey from '../../storage/get'
import getMaterials from './parametric-objects/common/get-materials'
var noIo3dComponents = ['plan', 'level', 'group']

export default async function toData3d(sceneStructure, options) {
  if (!sceneStructure) {
    throw new Error('sceneStructure is falsy')
  }

  options = options || {}

  let data3dStructure = await sceneStructreToData3dRec(sceneStructure, options.storage)
  data3dStructure = {data3d: data3dStructure }

  return data3dStructure
}



// recursivly convert sceneStructre
async function sceneStructreToData3dRec(sceneNode, options) {

  let data3dNode = {}         //TODO replace this with instantiation of new object
  data3dNode['_params'] = cloneDeep(sceneNode)  //let's not have any weird bugs

  data3dNode.position = [0,0,0]
  if (sceneNode.x) data3dNode.position[0] = sceneNode.x
  if (sceneNode.y) data3dNode.position[1] = sceneNode.y
  if (sceneNode.z) data3dNode.position[2] = sceneNode.z

  if (sceneNode.flipYZ){
    //TODO check if needed
    if (!sceneNode.rx) {
      sceneNode.rx=0
    }
    sceneNode.rx = sceneNode.rx - 90
  }

  data3dNode.rotDeg = [0,0,0]
  data3dNode.rotRad = [0,0,0]
  if (sceneNode.rx) {
    data3dNode.rotDeg[0] = sceneNode.rx%360
    data3dNode.rotRad[0] = data3dNode.rotDeg[0] * Math.PI / 180
  }
  if (sceneNode.ry) {
    data3dNode.rotDeg[1] = sceneNode.ry%360
    data3dNode.rotRad[1] = data3dNode.rotDeg[1] * Math.PI / 180
  }

  let scale = [1,1,1]
  if (sceneNode.sourceScale && sceneNode.sourceScale !== 1) {
    scale = [ sceneNode.sourceScale, sceneNode.sourceScale, sceneNode.sourceScale ]
  }

  if (!data3dNode.materials) data3dNode.materials={}
  if (sceneNode.materials) {
    Object.keys(sceneNode.materials).forEach(function(m){
      let sceneMat = sceneNode.materials[m]
      if (sceneMat && sceneMat.attributes) {
          data3dNode.materials[m] = cloneDeep( sceneMat.attributes )
      }
    })
  }

  let model;

  // now let's actually convert the sceneNode params into 3d model vertices etc
  if (Object.keys(paramGeneratorsMap).indexOf(sceneNode.type)>-1) {
    model = await paramGeneratorsMap[sceneNode.type](sceneNode)
  } else if (sceneNode.type==='object' ){
    // data3d models that are linked into the sceneStructure and have to be fetched from the internet
    model = await getData3dFromKey(sceneNode.object, options)
  } else {
    console.warn("Unmapped scenestructure element type "+sceneNode.type);
  }

  if (model) {

    data3dNode.meshes = cloneDeep(model.meshes);
    data3dNode.meshKeys = Object.keys(data3dNode.meshes)

    Object.keys(data3dNode.meshes).forEach(function(mk){
      data3dNode.meshes[mk].scale = scale;
    })

    if (model.materials) {
      // apply default materials from model if they are not defined in the scene node
      Object.keys(model.materials).forEach(function(m){
        if (!data3dNode.materials[m]) data3dNode.materials[m] = model.materials[m]
      })
    } else {
      data3dNode.materials = {}
    }

    data3dNode.materials = await getMaterials(data3dNode.materials)
    data3dNode.materialKeys = Object.keys(data3dNode.materials)

  } else {
    console.warn("No model resolved")
  }

  // recursivly resolve children
  if (sceneNode.children){
    data3dNode.children = await Promise.all(sceneNode.children.map(function(childSceneNode){
      return sceneStructreToData3dRec(childSceneNode, options)
    }))
  }

  return data3dNode
}
