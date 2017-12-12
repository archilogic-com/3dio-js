import uuid from '../../utils/uuid'
import defaults from 'lodash/defaults'
import getDefaults from './validate/get-defaults-by-type'

export default getSceneStructureFromAframeElements

const types = getDefaults()

function getSceneStructureFromAframeElements(el) {
  if (!isValidElement(el)) {
    console.error('element is not an "a-entity" DOM element')
    return
  }

  var
    position = el.getAttribute('position'),
    rotation = el.getAttribute('rotation'),
    id = el.getAttribute('io3d-uuid'),
    children= []

  if (typeof position === 'string') position = AFRAME.utils.coordinates.parse(position)
  if (typeof rotation === 'string') rotation = AFRAME.utils.coordinates.parse(rotation)
  var typeData = checkType(el)

  var childNodes = el.children
  if (childNodes && childNodes.length) {
    for (var i = 0; i < childNodes.length; i++) {
      var node = getSceneStructureFromAframeElements(childNodes[i])
      if (node) children.push(node)
    }
  }

  var sceneStructure = defaults(typeData, {
    x: parseFloat(position.x),
    y: parseFloat(position.y),
    z: parseFloat(position.z),
    ry: parseFloat(rotation.y),
    children: children,
    id: id || uuid.generate()
  })

  return sceneStructure
}

function checkType(el) {
  var elComponents = Object.keys(el.components)
  var data = {}
  // find component type match
  Object.keys(types).forEach(function(type) {
    if (types[type].aframeComponent) {
      var aframeName = types[type].aframeComponent.name
      if (elComponents.indexOf(aframeName) > -1) {
        data = el.getAttribute(aframeName)
        data.type = type
      }
    }
  })
  // map materials
  Object.keys(data).forEach(function(key) {
    if (key.indexOf('material_') > -1 ) {
      if (!data.materials) data.materials = {}
      var meshName = key.replace('material_', '')
      data.materials[meshName] = data[key]
      delete data[key]
    }
  })
  if (data.type === 'interior') {
    data.src = '!' + data.id
    delete data.id
  }
  if (data.type === 'polyfloor') {
    data.polygon = data.polygon.map(function(p) {
      return [parseFloat(p[0]), parseFloat(p[1])]
    })
  }
  return data
}


// Returns true if it is a DOM element with nodeName a-entity
// https://stackoverflow.com/a/384380/2835973
function isValidElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string" && o.nodeName.toLowerCase() === 'a-entity'
  );
}