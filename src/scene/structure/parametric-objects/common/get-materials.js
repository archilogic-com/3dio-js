'use strict';

import cloneDeep from 'lodash/cloneDeep'
import materialLibrary from './material-lib'
import getMaterial from './get-material'

// resolve standard materials if necessary
export default function (materials, defaults) {
  Object.keys(materials).map(meshName => {
    if (typeof(materials[meshName])==="string") {
      materials[meshName]=getMaterial(materials[meshName])
    }
  })
  return Promise.resolve(materials)
}
