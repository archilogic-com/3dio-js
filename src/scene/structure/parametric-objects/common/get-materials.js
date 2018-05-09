'use strict';

import cloneDeep from 'lodash/cloneDeep'
import materialLibrary from './material-lib'
import getMaterial from './get-material'

// resolve standard materials if necessary
export default function (materials, defaults) {
  var newMaterials = {}
  Object.keys(materials).map(meshName => {
    if (typeof(materials[meshName])==="string") {
      newMaterials[meshName] = getMaterial(materials[meshName])
    } else {
      newMaterials[meshName] = cloneDeep( materials[meshName] )
    }
  })
  return Promise.resolve(newMaterials)
}
