import callService  from '../utils/services/call.js'
import uuid from '../utils/uuid'

export default function furnish (args) {

  var
    modelStructure,
    floorLabels

  var data = verifyModelStructure(args.planStructure)

  if (args.planStructure) {
    modelStructure = data.modelStructure
  } else return

  floorLabels = getLabels(data.polyfloors)

  let params = {
    floors: floorLabels,
    modelStructure,
    maxResults: 1,
    tags: ['generic']
  }

  console.log('autofurnish', params)

  return callService('Autofurnishing.furnish', { arguments: params })
    .then(function(result) { return result.furnishings })
    /*.then(loadGroups)*/
    .catch(console.error)
}

// TODO: cleanup after API review
function verifyModelStructure(input) {
  var levelId = uuid.generate()
  var polyfloors = []
  var modelStructure = {
    activeLevelId: levelId,
    type: "plan",
    x: 0,
    y: 0,
    z: 0,
    ry: 0,
    id: uuid.generate(),
    children: [{
      type: 'level',
      id: levelId,
      x: 0,
      y: 0,
      z: 0,
      ry: 0,
      children: []
    }]
  }
  // add missing ids
  input = input.map(function(element) {
    if (!element.id) element.id = uuid.generate()
    if (!element.y) element.y = 0
    if (element.children) {
      element.children = element.children.map(function (child) {
        if (!child.id) child.id = uuid.generate()
        // apply defaults
        if (!child.y && child.type === 'window') {
          child.y = 0.9
          child.h = 1.5
        }
        else if (!child.y && child.type === 'door') {
          child.y = 0
          child.h = 2
        }
        return child
      })
    }
    if (element.type === 'polyfloor') polyfloors.push(element.id)
    return element
  })
  modelStructure.children[0].children = input
  return ({modelStructure, polyfloors})
}

function getLabels(polyfloors) {
  var labels = {}
  // TODO: provide functions in call
  labels[polyfloors[0]] = 'dining_living'
  if (polyfloors[4]) labels[polyfloors[4]] = 'homeOffice'
  if (polyfloors[3]) labels[polyfloors[3]] = 'bedroom'
  return labels
}
