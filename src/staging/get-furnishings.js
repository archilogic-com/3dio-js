import callService  from '../utils/services/call.js'
import uuid from '../utils/uuid'
import normalizeSceneStructure from '../scene/structure/normalize.js'
import defaults from 'lodash/defaults'
import Promise from 'bluebird'

export default function furnish (sceneStructure, options) {

  var
    modelStructure,
    options = options || {},
    spaceId = options.spaceId,
    label = options.label,
    tags = options.tags || ['generic'],
    spaceLabels = {}

  // make sure we're having a plan and a level object
  return normalizeInput(sceneStructure)
    .then(function(result) {

      // choose first space if none is specified
      if (!spaceId) {
        var polyfloors = result.children[0].children.filter(function(element3d) {
          return element3d.type === 'polyfloor'
        })
        spaceId = polyfloors[0].id
      }

      // set default space label if none provided
      spaceLabels[spaceId] = label || 'dining_living'

      // TODO: cleanup params after API review
      var params = {
        floors: spaceLabels,
        modelStructure: result,
        maxResults: 1,
        tags: tags
      }

      // do the actual home staging api call
      return callService('Autofurnishing.furnish', { arguments: params })
    })
    .then(getSceneStructureFromFurnishingResult)
    .catch(function(error) {
      console.error('HomeStaging error:', error)
      return Promise.reject('HomeStaging failed - check console for details')
    })
}

// completes sceneStructure with plan and level object
function normalizeInput(input) {
  if (input.type !== 'plan') {
    if (Array.isArray(input)) {
      if (input[0].type !== 'level') {
        var levelId = uuid.generate()
        input = {
          type: "plan",
          activeLevelId: levelId,
          children: [{
            type: 'level',
            id: levelId,
            children: input
          }]
        }
      } else {
        input = {
          type: "plan",
          children: input
        }
      }
    } else if (input.type === 'level') {
      input = {
        type: "plan",
        children: [ input ]
      }
    } else {
      console.error('Furnishing failed - input is invalid:', input)
      return Promise.reject('Furnishing failed - check console for details')
    }
  }
  return normalizeSceneStructure(input)
}

function getSceneStructureFromFurnishingResult(result) {
  // assumes that only one space is furnished at a time
  var spaceId = Object.keys(result.furnishings)[0]

  if (spaceId in result.errors) {
    return Promise.reject(result.errors[spaceId])
  }

  // get furniture groups from api result
  // assumes that only one result is requested from the home stagin API
  var groups = result.furnishings[spaceId][0].groups

  // get normailzed sceneStructure for each furniture group
  return Promise.map(groups, getFurnitureGroupData)
    .then(normalizeSceneStructure)
}

// combine data from staging API with data from furniture API
function getFurnitureGroupData(group) {
  var id = group.src.substring(1)
  // get raw data from Furniture API
  return callService('Product.read', { arguments: id})
    .then(function(furniture) {
      // get sceneStructure from Furniture API -> info on type and possible children
      var sceneStructure = JSON.parse(furniture.modelStructure)
      // combine data from both API calls to turn result into full sceneStructure
      sceneStructure = defaults({}, group, sceneStructure)
      return Promise.resolve(sceneStructure)
    })
}
