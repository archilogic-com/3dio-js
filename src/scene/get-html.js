import getStructure from './structure/get.js'
import getHtmlFromSceneStructure from './structure/to-html.js'

export default function getHtml(id) {
  return getStructure(id)
    .then(getHtmlFromSceneStructure)
}