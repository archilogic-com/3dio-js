import getFurnitureAlternatives from './get-furniture-alternatives.js'
import getSceneStructureFromAframeElements from '../scene/structure/from-aframe-elements.js'
import getAframeElementsFromSceneStructure from '../scene/structure/to-aframe-elements.js'
import normalizeSceneStructure from '../scene/structure/normalize.js'
import defaults from 'lodash/defaults'
import Promise from 'bluebird'

// consumes sceneStructure or DOM elements
// replaces furniture Ids and adjusts positioning
// outputs input type
export default function replaceFurniture (input, options) {

  options = options || {}
  var query = options.query
  // defaults to pick a random item from alternatives
  var random = options.random || true
  var furnitureIds

  // check for DOM element
  var isDomElement = isElement(input)
  if (isDomElement) {
    // convert to sceneStructure
    input = getSceneStructureFromAframeElements(input)
  }

  return normalizeSceneStructure(input)
    .then(function(sceneStructure) {
      furnitureIds = getIdsFromSceneStructure(sceneStructure)

      if (Object.keys(furnitureIds).length === 0) return Promise.reject('No valid furniture elements were found')

      var promises = []
      Object.keys(furnitureIds).forEach(function(id) {
        promises.push(getFurnitureAlternatives(id, options))
      })

      return Promise.all(promises)
    })
    .then(function(result) {
      var alternatives = {}
      Object.keys(furnitureIds).forEach(function(id, index) {
        alternatives[id] = result[index]
      })

      // replace params in furniture elements
      var sceneStructure = updateSceneStructureWithResult(input, alternatives, random)
      if (isDomElement) {
        return getAframeElementsFromSceneStructure(sceneStructure)
      } else return sceneStructure
    })
    .catch(function(error) {
      console.error(error)
      return Promise.reject(error)
    })
}

function getIdsFromSceneStructure(sceneStructure) {
  var isArray = Array.isArray(sceneStructure)
  sceneStructure = isArray ? sceneStructure : [sceneStructure]

  var collection = {}
  sceneStructure.forEach(function(element3d) {
    // get all furniture elements = type: 'interior'
    if (element3d.type === 'interior' && element3d.src && typeof element3d.src === 'string') collection[element3d.src.substring(1)] = true
    // recursively search through scene structure
    if (element3d.children && element3d.children.length) {
      collection = defaults({}, collection, getIdsFromSceneStructure (element3d.children))
    }
  })
  return collection
}

// Returns true if it is a DOM element
// https://stackoverflow.com/a/384380/2835973
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}

function updateSceneStructureWithResult(input, alternatives, random) {
  var
    sceneStructure = input,
    replacement,
    index = 0

  Object.keys(alternatives).forEach(function(id) {

    if (!alternatives[id] || !alternatives[id].length) return
    // we the pick a random item or take the first one
    if (random) index = Math.floor(Math.random() * alternatives[id].length)

    replacement = alternatives[id][index]

    sceneStructure = updateElementsById(sceneStructure, id, replacement)
  })
  return sceneStructure
}

// search by furniture id and replace params
function updateElementsById(sceneStructure, id, replacement) {
  var isArray = Array.isArray(sceneStructure)
  sceneStructure = isArray ? sceneStructure : [sceneStructure]

  sceneStructure = sceneStructure.map(function(element3d) {
    // furniture id is stored in src param
    if (element3d.type === 'interior' && element3d.src.substring(1) === id && replacement.furniture) {
      // apply new id
      element3d.src = '!' + replacement.furniture.id
      // compute new position for items that differ in size and mesh origin
      var newPosition = getNewPosition(element3d, replacement.offset)
      // apply new position
      element3d.x = newPosition.x
      element3d.y = newPosition.y
      element3d.z = newPosition.z
    }
    // recursivley search tree
    if (element3d.children && element3d.children.length) {
      element3d.children = updateElementsById(element3d.children, id, replacement)
    }
    return element3d
  })

  return isArray ? sceneStructure : sceneStructure[0]
}

// compute new position based on bounding boxes
function getNewPosition(element3d, offset) {

  var s = Math.sin(element3d.ry / 180 * Math.PI)
  var c = Math.cos(element3d.ry / 180 * Math.PI)
  var newPosition = {
    x: element3d.x + offset.x * c + offset.z * s,
    y: element3d.y + offset.y,
    z: element3d.z - offset.x * s + offset.z * c
  }
  return newPosition
}
