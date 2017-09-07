import callService  from '../utils/services/call.js'
import uuid from '../utils/uuid'
import normalizeSceneStructure from '../scene/structure/normalize.js'

export default function furnish (sceneStructure, options) {

  var
    modelStructure,
    options = options || {},
    spaceId = options.spaceId,
    label = options.label,
    floorLabels = {}

  // make sure we're having a plan and a level object
  return verifySceneStructure(sceneStructure)
    .then(function(result) {
      console.log(result)

      if (!spaceId) {
        var polyfloors = result.children[0].children.filter(function(element3d) {
          return element3d.type === 'polyfloor'
        })
        spaceId = polyfloors[0].id
      }

      // set default space label if none provided
      floorLabels[spaceId] = label || 'living'

      var params = {
        floors: floorLabels,
        modelStructure: result,
        maxResults: 1,
        tags: ['generic']
      }

      console.log('autofurnish', params)
      return callService('Autofurnishing.furnish', { arguments: params })
    })
    .then(function(result) { return result.furnishings })
    .catch(console.error)
}

// TODO: cleanup after API review
function verifySceneStructure(input) {
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
