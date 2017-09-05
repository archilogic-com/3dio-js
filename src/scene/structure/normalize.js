import applyDefaults from './apply-defaults.js'
import removeUnknown from './remove-unknown.js'

export default function normalizeSceneStructure(elements3d) {

  // model structure can be a sole element or array of element
  // make sure we return the same type
  var inputIsArray = Array.isArray(elements3d)
  // start recursive validation
  var normalizedSceneStructure = normalizeElements3d(inputIsArray ? elements3d : [elements3d])

  return Promise.resolve(inputIsArray ? normalizedSceneStructure : normalizedSceneStructure[0])
}

function normalizeElements3d(input) {
  return input.map(function(element3d) {
    element3d = removeUnknown(element3d)
    // recursive parsing through scene structure
    if (element3d && element3d.children && element3d.children.length) {
      element3d.children = normalizeElements3d(element3d.children)
    }
    return applyDefaults(element3d)
  }).filter(function(element3d) {
    return element3d !== undefined
  })
}
