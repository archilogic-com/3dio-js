import callServices from '../utils/services/call.js'

// main
function getModifier(modifier) {
  return function modifyModel(storageId, options) {

    // API
    options = options || {}

    var modifyParams = {
      method: 'modify'.concat('.', modifier),
      params: {
        inputFileKey: storageId
      }
    }

    if (options.subdivisions) {
      modifyParams.params.settings = JSON.stringify( { subdivisions: options.subdivisions } )
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