import getViewerUrl from './scene/get-viewer-url.js'
import validateSceneStructure from './scene/structure/validate.js'
import normalizeSceneStructure from './scene/structure/normalize.js'
import getHtmlFromSceneStructure from './scene/structure/to-html.js'

var scene = {
  getViewerUrl: getViewerUrl,
  validateSceneStructure: validateSceneStructure,
  normalizeSceneStructure: normalizeSceneStructure,
  getHtmlFromSceneStructure: getHtmlFromSceneStructure
}

export default scene