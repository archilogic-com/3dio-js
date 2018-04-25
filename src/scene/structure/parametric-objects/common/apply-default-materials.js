'use strict';

import cloneDeep from 'lodash/cloneDeep'

// apply default material names to object in case material key is unset
export default function(materials, defaults){

  if (!defaults) {
    console.error('No default materials set')
    defaults={}
  }

  if (!materials) return Promise.resolve(cloneDeep(defaults))

  Object.keys(defaults).forEach(function(d){
    if (!materials[d]) materials[d]=defaults[d]
  })

  return materials
}
