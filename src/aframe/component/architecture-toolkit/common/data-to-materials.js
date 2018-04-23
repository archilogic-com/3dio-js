'use strict';
import cloneDeep from 'lodash/cloneDeep'
import getMaterial from '../../../../scene/structure/parametric-objects/common/get-material.js'

export default function dataToMaterials(data) {

  let materials={}

  var materialKeys = Object.keys(data).filter(function(key) {
    return key.indexOf('material_') > -1
  })

  materialKeys.forEach(function(key) {
    var mesh = key.replace('material_', '')
    materials[mesh] = data[key]
  })

  Object.keys(materials).forEach(mat => {
    materials[mat] = getMaterial(materials[mat])
  })

  return materials;
}
