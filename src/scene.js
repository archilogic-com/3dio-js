import getViewerUrl from './scene/get-viewer-url.js'
import validateSceneStructure from './scene/structure/validate.js'
import normalizeSceneStructure from './scene/structure/normalize.js'

var scene = {
  getViewerUrl: getViewerUrl,
  validateSceneStructure: validateSceneStructure,
  normalizeSceneStructure: normalizeSceneStructure
}

export default scene