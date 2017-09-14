import getStructure from './scene/structure/get.js'
import getHtml from './scene/get-html.js'
import getViewerUrl from './scene/get-viewer-url.js'
import validateSceneStructure from './scene/structure/validate.js'
import normalizeSceneStructure from './scene/structure/normalize.js'
import getHtmlFromSceneStructure from './scene/structure/to-html.js'

var scene = {
  getStructure: getStructure,
  getHtml: getHtml,
  getViewerUrl: getViewerUrl,
  validateSceneStructure: validateSceneStructure,
  normalizeSceneStructure: normalizeSceneStructure,
  getHtmlFromSceneStructure: getHtmlFromSceneStructure
}

export default scene