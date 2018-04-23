'use strict';

import getDefaultsByType from './validate/get-defaults-by-type.js'
import getParamValueType from './validate/get-param-value-type.js'
import uuid from '../../utils/uuid'

export default function applyDefaults(element3d) {
  if (!element3d || !element3d.type) return

  var typeSpecificDefaults = getDefaultsByType()
  var defaultParams = typeSpecificDefaults[element3d.type].params

  Object.keys(defaultParams).forEach(function (key) {
    var defaultVal = defaultParams[key].defaultValue
    // check if type is valid
    if (element3d[key]) {
      var paramType = defaultParams[key].type
      var elParamType = getParamValueType(element3d[key], paramType)
      // check if type is valid
      if (paramType !== elParamType) {
        // try to fix integers
        if (paramType === 'int' && parseInt(element3d[key])) element3d[key] = parseInt(element3d[key])
        // try to fix floats
        else if (paramType === 'number' && parseFloat(element3d[key])) element3d[key] = parseFloat(element3d[key])
        // set default
        else if (defaultVal !== undefined) element3d[key] = defaultVal
        else delete element3d[key]
      }
    }
    // apply default
    if (element3d[key] === undefined) {
      // id needs to be generated hence no defaultValue
      if (key === 'id') element3d[key] = uuid.generate()
      // apply default value
      else if (defaultVal !== undefined) element3d[key] = defaultVal
    }
  })
  return element3d
}
