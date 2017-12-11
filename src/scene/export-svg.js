import callService  from '../utils/services/call.js'

export default function exportSvg (args) {
  if (!args.sceneStructure || typeof args.sceneStructure !== 'object') {
    return Promise.reject('Svg export failed: invalid input')
  }
  return callService('Scene.exportSvg', {arguments: args})
    .catch(function(error) {
      console.error(error)
      return Promise.reject('Svg export failed: check console for details')
    })
}
