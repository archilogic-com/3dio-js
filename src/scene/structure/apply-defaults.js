import getDefaultsByType from './validate/get-defaults-by-type.js'
import uuid from '../../utils/uuid'

export default function applyDefaults(element3d) {
  if (!element3d || !element3d.type) return

  var typeSpecificDefaults = getDefaultsByType()
  var defaultParams = typeSpecificDefaults[element3d.type].params

  Object.keys(defaultParams).forEach(function (key) {
    if (!element3d[key]) {
      // id needs to be generated hence no defaultValue
      if (key === 'id') element3d[key] = uuid.generate()
      // apply default value
      else if (defaultParams[key].defaultValue !== undefined) element3d[key] = defaultParams[key].defaultValue
    }
  })
  return element3d
}