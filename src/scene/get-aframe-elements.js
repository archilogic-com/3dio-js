import getStructure from './structure/get.js'
import getAframeElementsFromSceneStructure from './structure/to-aframe-elements.js'

export default function getAframeElements(id) {
  return getStructure(id)
    .then(getAframeElementsFromSceneStructure)
}