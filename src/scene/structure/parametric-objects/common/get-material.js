'use strict';

import cloneDeep from 'lodash/cloneDeep'
import materialLibrary from './material-lib.js'
import pathUtils from  '../../../../utils/file/path.js'
export default function (material) {

  var mat = materialLibrary[material]

  if (!mat) {
    console.warn(`Material '${material}' not found in standard library.`)
    return material
  }
  var attr = cloneDeep(mat.attributes)
  Object.keys(attr).filter(a=>a.indexOf('map') > -1).forEach(a => {
    attr[a]=pathUtils.ensureBeginsWithSlash(attr[a])
  })
  return attr
}
