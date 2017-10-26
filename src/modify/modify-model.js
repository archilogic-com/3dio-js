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

    return callServices('Processing.task.enqueue', modifyParams)

  }
}

// expose api

export default {
  origami: getModifier('origami'),
  consolidateFaceSides: getModifier('consolidateFaceSides')
}