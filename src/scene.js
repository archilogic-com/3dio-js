import getStructure from './scene/structure/get.js'
import getAframeElements from './scene/get-aframe-elements.js'
import getViewerUrl from './scene/get-viewer-url.js'
import validateSceneStructure from './scene/structure/validate.js'
import normalizeSceneStructure from './scene/structure/normalize.js'
import getAframeElementsFromSceneStructure from './scene/structure/to-aframe-elements.js'

var scene = {
  getStructure: getStructure,
  getAframeElements: getAframeElements,
  getViewerUrl: getViewerUrl,
  validateSceneStructure: validateSceneStructure,
  normalizeSceneStructure: normalizeSceneStructure,
  getAframeElementsFromSceneStructure: getAframeElementsFromSceneStructure
}

export default scene