'use strict';

import cloneDeep from 'lodash/cloneDeep'
import poll from '../../utils/poll'
import getFromStorage from '../../storage/get'
import getDefaultsByType from './validate/get-defaults-by-type'
import paramGeneratorsMap from './parametric-objects/common/all'

var noIo3dComponents = ['plan', 'level', 'group']

export default async function toData3d(sceneStructure, options) {
  if (!sceneStructure) {
    throw new Error('sceneStructure is falsy')
  }

  // api
  options = options || {}

  // let's make a clone before we start modifying
  let data3dStructure = await sceneStructreToData3dRec(sceneStructure)
  data3dStructure = {data3d: data3dStructure }

  return stringifyRealArrays(data3dStructure)
}


// Float32Array gets encoded as { '0':23, '1':42, ...}, so let's fix that
// by converting them to normal arrays like this:
export function stringifyRealArrays(object){
  return JSON.stringify( object, function(key, value) {
    if (value instanceof  Float32Array) {
      return Array.apply([], value)
    } else {
      return value
    }
  })
}

// recursivly convert sceneStructre
async function sceneStructreToData3dRec(sceneNode, parent) {

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

  // child nodes
  data3dNode.children = await Promise.all(sceneNode.children.map(function(childSceneNode){
    return sceneStructreToData3dRec(childSceneNode)
  }))
  // now let's actually convert the scenNode params into 3d model vertices etc
  if (Object.keys(paramGeneratorsMap).indexOf(sceneNode.type)>-1) {
    let data3dModel = await paramGeneratorsMap[sceneNode.type](sceneNode)
    data3dNode.meshes = data3dModel.meshes
    data3dNode.materials = data3dModel.materials
    data3dNode.meshKeys = Object.keys(data3dModel.meshes)
    data3dNode.materialKeys = Object.keys(data3dModel.materials)
  } else {
    console.warn("unmapped type "+sceneNode.type);
  }

  return data3dNode
}

// get html attributes from element3d params
export const getAttributes = function(element3d) {
  var attributes = {}

  // map type specific attributes
  // camera-bookmarks and bakedModel are handled separately
  var type = element3d.type
  var validParams = getDefaultsByType(type).params
  // support for old material definitions
  // TODO: this should be cleaned up in the database
  var elKeys = Object.keys(element3d)
  elKeys.forEach(function(key) {
    if (key.indexOf('Material') > -1) {
      if (!element3d.materials) element3d.materials = {}
      element3d.materials[key.replace('Material', '')] = element3d[key]
      delete element3d[key]
    }
    else if (key === 'material' && type === 'floor') {
      if (!element3d.materials) element3d.materials = {}
      element3d.materials.top = element3d[key]
    }
  })

  var paramKeys = Object.keys(validParams)

  // plan, level, group don't have their own component
  var skipComponent = noIo3dComponents.indexOf(type) > -1
  if (!skipComponent) {
    attributes['io3d-' + type] = ''

    paramKeys.forEach(function(param) {
      if (element3d[param] !== undefined && !validParams[param].skipInAframe) {
        // materials have to be serialized
        if (param === 'materials') attributes['io3d-' + type] += stringifyMaterials(element3d.materials)
        // polygons have to be serialized
        else if (param === 'polygon') attributes['io3d-' + type] += param + ': ' + JSON.stringify(element3d.polygon) + '; '
        // stringify window segmentation arrays
        else if (param === 'columnRatios' || param === 'rowRatios') attributes['io3d-' + type] += param + ': ' + JSON.stringify(element3d[param]) + '; '
        // skip plan and level and map all remaining params
        else if (type !== 'plan' && type !== 'level') attributes['io3d-' + type] += param + ': ' + element3d[param] + '; '
      }
    })
  }

  switch (element3d.type) {
    case 'plan':
      attributes['class'] = 'io3d-scene'
      break
    case 'level':
      attributes['class'] = 'io3d-level'
      break
    case 'group':
      attributes['class'] = 'io3d-group'
      break
    case 'interior':
      if (element3d.src) {
        attributes['io3d-furniture'] = 'id: ' + element3d.src.substring(1)
        // apply custom material settings for furniture items
        if (element3d.materials) {
          var mats = element3d.materials
          // materials can be saved as arrays
          if (Array.isArray(mats)) {
            var matObj = {}
            mats.forEach(function (mat) {
              if (mat.mesh && mat.material) matObj[mat.mesh] = mat.material
            })
            mats = matObj
          }
          // apply alternative material setting to io3d-furniture attribute
          if (typeof mats === 'object') {
            Object.keys(mats).forEach(function (mesh) {
              if (mesh && mats[mesh]) attributes['io3d-furniture'] += '; material_' + mesh.replace(/\s/g, '_') + ':' + mats[mesh]
            })
          }
        }
        attributes['shadow'] = 'cast: true; receive: false'
      } else console.warn('unsupported interior type')
      break
    case 'object':
      attributes['io3d-data3d'] = 'key: ' + element3d.object
      attributes['shadow'] = 'cast: true; receive: true'
      break
  }

  // and generic attributes that apply for all nodes
  // check for custom scale
  if (element3d.sourceScale && element3d.sourceScale !== 1) attributes.scale = element3d.sourceScale + ' ' + element3d.sourceScale + ' ' + element3d.sourceScale
  // check for axis flipping of source file
  if (element3d.flipYZ) element3d.rx = element3d.rx ? element3d.rx -= 90 : -90
  // toggle visibility
  if (element3d.bake && element3d.bakeStatus === 'done') attributes.visible = false
  if (element3d.visible && !element3d.visible.bird && !element3d.visible.person && !element3d.visible.floorplan) attributes.visible = false
  // make sure we have a valid position
  element3d.x = element3d.x || 0
  element3d.y = element3d.y || 0
  element3d.z = element3d.z || 0
  element3d.ry = element3d.ry|| 0
  // stringify location objects
  attributes.position = element3d.x + ' ' + element3d.y + ' ' + element3d.z
  attributes.rotation = (element3d.rx || 0) + ' ' + element3d.ry + ' 0'
  attributes['io3d-uuid'] = element3d.id

  return attributes
}

// creates a child for a baked model in the current element
function createBakedElement(parentElem, element3d) {
  // we might have a scene that has no baked level
  if (!element3d.bakedModelUrl && !element3d.bakePreviewStatusFileKey) {
    console.warn('Level without bakedModelUrl: ', element3d)
    return
  }
  // set data3d.buffer file key
  var attributes = {
    'io3d-data3d': 'key: ' + element3d.bakedModelUrl,
    shadow: 'cast: false; receive: true'
  }
  // set lightmap settings
  if (element3d.lightMapIntensity) {
    attributes['io3d-data3d'] += '; lightMapIntensity: ' + element3d.lightMapIntensity + '; lightMapExposure: ' + element3d.lightMapCenter
  }

  var bakedElem = addEntity({
    attributes: attributes,
    parent: parentElem
  })

  if (element3d.bakeRegularStatusFileKey || element3d.bakePreviewStatusFileKey) {
    updateOnBake(bakedElem, element3d)
  }

}

function sphericalToCartesian(element) {
  // Rotate look-at point on the XZ plane around parent's center
  var angleY = -element.parent.ry * Math.PI / 180

  var rotatedX = element.x * Math.cos(angleY) - element.z * Math.sin(angleY)
  var rotatedZ = element.z * Math.cos(angleY) + element.x * Math.sin(angleY)

  // Get world space coordinates for our look-at point
  var position = {}
  position.x = element.parent.x + rotatedX
  position.y = element.parent.y + element.y
  position.z = element.parent.z + rotatedZ

  // Get camera position by rotating around the look-at point at a distance of element.distance.
  // This will make very little difference for 'person'-type bookmarks, but it should be done for
  // the sake of correctness.
  var rx =                      element.rx  * Math.PI / 180
  var ry = (element.parent.ry + element.ry) * Math.PI / 180

  position.x -= element.distance * Math.sin(ry) * Math.cos(rx)
  position.y -= element.distance * Math.sin(rx)
  position.z -= element.distance * Math.cos(ry) * Math.cos(rx)

  // Finally, get camera rotation. Note that it's necessary to add 180 degrees to the rotation angle
  // because of A-Frame's different convention. Also note that when animating the camera, the rotation
  // angle should be interpolated through the shortest arc in order to avoid swirling motion.
  var rotation = {}
  rotation.x = element.rx
  rotation.y = 180 + element.parent.ry + element.ry

  if (element.mode === 'bird' || element.mode === 'floorplan') position.y = Math.max(element.distance - 5, 8)

  return {
    rotation: rotation.x + ' ' + rotation.y + ' 0', //rotation,
    position: position.x + ' ' + position.y + ' ' + position.z // position
  }
}


function addEntity(args) {
  var
    tag = args.tag || 'a-entity',
    parent = args.parent,
    attributes = args.attributes || {}

  var el = document.createElement(tag)

  Object.keys(attributes).forEach(function(key) {
    el.setAttribute(key, attributes[key])
  })

  if (parent) return parent.appendChild(el)
  else return el
}

function updateOnBake(htmlElement, element3d) {
  var statusFileKey = element3d.bakeRegularStatusFileKey || element3d.bakePreviewStatusFileKey

  pollStatusFile(statusFileKey)
    .then(function (bakedModelKey) {
      var attribValue = 'key: ' + bakedModelKey
      if (element3d.lightMapIntensity) {
        attribValue += '; lightMapIntensity: ' + element3d.lightMapIntensity + '; lightMapExposure: ' + element3d.lightMapCenter
      }

      htmlElement.setAttribute('io3d-data3d', attribValue)
    })
}

// TODO: Migrate that to a shared helper

function pollStatusFile(fileKey) {
  return poll(function onPoll(onSuccess, onError, next) {
    /*
    1. Read status file content
    2. Check if we're done -> call onSuccess
       Check if it failed  -> call onError
       Otherwise call next
     */
    getFromStorage(fileKey, { type: "json", cdn: false }).then(function checkContent(content) {
      if (content && content.params) {
        switch (content.params.status) {
          case 'SUCCESS':
            onSuccess(content.params.data)
            break
          case 'PROCESSING':
          case 'ENQUEUED':
            next()
            break
          default:
            onError(content.params.data)
        }
      }
    })
  })
}

function flattenSceneStructure(sceneStructure, parent) {
  var result = []
  sceneStructure.parent = parent
  result.push(sceneStructure)
  if(sceneStructure.children) {
    sceneStructure.children.forEach(function (child) {
      result = result.concat(flattenSceneStructure(child, sceneStructure))
    })
  }
  return result
}

function stringifyMaterials (materials) {
  var matStr = ''
  var matKeys = Object.keys(materials)
  matKeys.forEach(function (key) {
    // currently only library materials are supported
    if (typeof materials[key] === 'string') {
      matStr += 'material_' + key + ':' + materials[key] + '; '
    } else if (typeof materials[key] === 'object' && materials[key].mesh && materials[key].material) {
      matStr += 'material_' + materials[key].mesh + ':' + materials[key].material + '; '
    }
  })
  return matStr
}

function deg2rad(x) { return x * (Math.PI / 180) }
function rad2deg(x) { return x * (180 / Math.PI) }
