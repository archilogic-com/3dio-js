import getStructure from './scene/structure/get.js'
import getAframeElements from './scene/get-aframe-elements.js'
import getViewerUrl from './scene/get-viewer-url.js'
import validateSceneStructure from './scene/structure/validate.js'
import normalizeSceneStructure from './scene/structure/normalize.js'
import getAframeElementsFromSceneStructure from './scene/structure/to-aframe-elements.js'
import getSceneStructureFromAframeElements from './scene/structure/from-aframe-elements.js'
import exportSvg from './scene/export-svg.js'
import snapWalls from './scene/structure/utils/snap-walls.js'
import applyParentLocation from './scene/structure/utils/apply-parent-location.js'

var scene = {
  getStructure: getStructure,
  getHtml: getHtml,
  getAframeElements: getAframeElements,
  getViewerUrl: getViewerUrl,
  validateSceneStructure: validateSceneStructure,
  normalizeSceneStructure: normalizeSceneStructure,
  getHtmlFromSceneStructure: getHtmlFromSceneStructure,
  getAframeElementsFromSceneStructure: getAframeElementsFromSceneStructure,
  getSceneStructureFromAframeElements: getSceneStructureFromAframeElements,
  snapWalls: snapWalls,
  applyParentLocation: applyParentLocation,
  exportSvg: exportSvg
}

function getHtml() {
  console.warn('io3d.scene.getHtml will be removed soon please use io3d.scene.getAframeElements')
  return getAframeElements.apply( getAframeElements, arguments )
}

function getHtmlFromSceneStructure() {
  console.warn('io3d.scene.getHtmlFromSceneStructure will be removed soon please use io3d.scene.getAframeElementsFromSceneStructure')
  return getAframeElementsFromSceneStructure.apply( getAframeElementsFromSceneStructure, arguments )
}

export default scene