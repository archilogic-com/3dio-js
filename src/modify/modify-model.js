import callServices from '../utils/services/call.js'

// main
function getModifier(modifier) {
  return function modifyModel(storageId, options) {

    // API
    options = options || {}

    var modifySettings = {}
    if (options.ratio) modifySettings.ratio = options.ratio
    if (options.subdivisions) modifySettings.subdivisions = options.subdivisions

    var modifyParams = {
        method: 'modify'.concat('.', modifier),
        params: {
            inputFileKey: storageId
        }
    }

    if (Object.keys(modifySettings).length > 0) {
        modifyParams.params.settings = JSON.stringify(modifySettings)
    }
    
    return callServices('Processing.task.enqueue', modifyParams)

  }
}

// expose api

export default {
  collisionObject: getModifier('collisionObject'),
  consolidateFaceSides: getModifier('consolidateFaceSides'),
  origami: getModifier('origami')
}