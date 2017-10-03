import importThreeObject from './import-three-object.js'

export default function importAframeElement(selector) {

  var threeObject = document.querySelector(selector).object3D

  return importThreeObject(threeObject)

}