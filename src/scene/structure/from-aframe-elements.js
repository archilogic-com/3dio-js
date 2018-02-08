import uuid from '../../utils/uuid'
import defaults from 'lodash/defaults'
import getDefaults from './validate/get-defaults-by-type'
import applyDefaults from './apply-defaults'

const types = getDefaults()

export default function getSceneStructureFromAframeElements(el) {
  if (!isValidElement(el)) {
    console.warn('element is not an "a-entity" DOM element')
    return
  }

  var
    position = el.getAttribute('position') || {x: 0, y: 0, z: 0},
    rotation = el.getAttribute('rotation') || {x: 0, y: 0, z: 0},
    id = el.getAttribute('io3d-uuid'),
    children = []

  if (typeof position === 'string') position = stringToCoordinate(position)
  if (typeof rotation === 'string') rotation = stringToCoordinate(rotation)
  var typeData = checkType(el)

  var childNodes = el.children
  if (childNodes && childNodes.length) {
    for (var i = 0; i < childNodes.length; i++) {
      var node = getSceneStructureFromAframeElements(childNodes[i])
      if (node) children.push(node)
    }
  }

  var sceneStructure = defaults({
    x: parseFloat(position.x),
    y: parseFloat(position.y),
    z: parseFloat(position.z),
    ry: parseFloat(rotation.y),
    children: children,
    id: id || uuid.generate()
  }, typeData)

  return sceneStructure
}

export const checkType = function(el) {
  var elComponents = el.getAttributeNames() // Object.keys(el.components)
  var data = {}
  // find component type match
  Object.keys(types).forEach(function(type) {
    if (types[type].aframeComponent) {
      var aframeName = types[type].aframeComponent.name
      if (elComponents.indexOf(aframeName) > -1) {
        data = el.getAttribute(aframeName)
        if (typeof data === 'string') data = parseComponent(data, type)
        else data.type = type
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
function isValidElement(o) {
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string" && o.nodeName.toLowerCase() === 'a-entity'
  );
}

export const stringToCoordinate = function(string) {
  var axis = ['x','y','z']
  var arr = string.split(' ').map((v, i) => {
    let obj = {}
    obj[axis[i]] = parseFloat(v)
    return obj
  })
  return arr.reduce((a, b) => Object.assign(a, b), {})
}

export const parseComponent = function(str, type) {
  var arr = str.split(';')
    .map(v => v.split(':'))
    .map(v => {
      let obj = {}
      obj[v[0].trim()] = v[1].trim()
      return obj
    })
  let el3d = defaults(...arr)
  el3d.type = type
  return applyDefaults(el3d)
}