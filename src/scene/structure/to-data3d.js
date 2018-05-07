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

  let data3dNode = {}
  data3dNode['_params']=cloneDeep(sceneNode) //let's not have any weird bugs
  data3dNode.nodeId = sceneNode.id

  // defaults
  data3dNode.meshes = {}
  data3dNode.materials = {}
  data3dNode.meshKeys = []
  data3dNode.materialKeys = []
  data3dNode.position = [0,0,0]
  data3dNode.rotDeg = [0,0,0]
  data3dNode.rotRad = [0,0,0]
  data3dNode.scale = [1,1,1]

  if (sceneNode.sourceScale && sceneNode.sourceScale !== 1) {
    data3dNode.scale = [ sceneNode.sourceScale, sceneNode.sourceScale, sceneNode.sourceScale ]
  }

  if (sceneNode.rx) {
    data3dNode.rotDeg[0] = sceneNode.rx
    data3dNode.rotDeg[0] = sceneNode.rx * Math.PI / 180
  }
  if (sceneNode.ry) {
    data3dNode.rotDeg[1] = sceneNode.ry
    data3dNode.rotRad[1] = sceneNode.ry * Math.PI / 180
  }
  if (sceneNode.flipYZ){
    //TODO check if needed and remove
    element3d.rx = element3d.rx - 90
  }
  if (sceneNode.x) data3dNode.position[0] = sceneNode.x
  if (sceneNode.y) data3dNode.position[1] = sceneNode.y
  if (sceneNode.z) data3dNode.position[2] = sceneNode.z

  let data3dModel;

  // now let's actually convert the sceneNode params into 3d model vertices etc
  if (Object.keys(paramGeneratorsMap).indexOf(sceneNode.type)>-1) {
    data3dModel = await paramGeneratorsMap[sceneNode.type](sceneNode)
    console.log('sceneNode', sceneNode)
    console.log('data3dModel', data3dModel)
  } else if (sceneNode.type==='object' ){
    // data3d models that are linked into the sceneStructure and have to be fetched from the internet
    console.log("Fetching model from path "+sceneNode.object,options)
    data3dModel = await getData3dFromKey(sceneNode.object, options)
  } else {
    console.warn("Unmapped scenestructure element type "+sceneNode.type);
  }

  if (data3dModel) {
    data3dNode.meshes = data3dModel.meshes
    data3dNode.meshKeys = Object.keys(data3dNode.meshes)

    data3dNode.materials = data3dModel.materials
    if (data3dModel.materials) {
      console.log('data3dNode.materials', JSON.stringify(data3dNode.materials))
      data3dNode.materials = await getMaterials(data3dModel.materials)
    } else {
      console.log('data3dNode.materials empty for', sceneNode.type)
      data3dNode.materials = {}
    }
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
