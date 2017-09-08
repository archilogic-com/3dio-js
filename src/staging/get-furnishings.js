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
    spaceLabels = {}

  // make sure we're having a plan, a level object and a
  return normalizeInput(sceneStructure)
    .then(function(result) {
      console.log(result)

      if (!spaceId) {
        var polyfloors = result.children[0].children.filter(function(element3d) {
          return element3d.type === 'polyfloor'
        })
        spaceId = polyfloors[0].id
      }

      // set default space label if none provided
      spaceLabels[spaceId] = label || 'living'

      // TODO: cleanup params after API review
      var params = {
        floors: spaceLabels,
        modelStructure: result,
        maxResults: 1,
        tags: ['generic']
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
  var furnishing = result.furnishings
  var spaceIds = Object.keys(furnishing)
  if (!uuid.validate(spaceIds[0])) return Promise.reject('No furnishings were found')
  var groups = furnishing[spaceIds[0]][0].groups

  return Promise.map(groups, getFurnitureGroupData)
    .then(normalizeSceneStructure)
}

function getFurnitureGroupData(args) {
  var id = args.src.substring(1)
  var group
  return callService('Product.read', { arguments: id})
    .then(product => {
      var ms = JSON.parse(product.modelStructure)
      var sceneStructure = defaults({}, args, ms)
      return Promise.resolve(sceneStructure)
    })
}