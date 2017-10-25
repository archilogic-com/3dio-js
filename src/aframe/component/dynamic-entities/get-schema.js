import getDefaultsByType from '../../../scene/structure/validate/get-defaults-by-type'

function getSchema (type) {
  // get valid params and default values for each type
  var validProps = getDefaultsByType(type)
  let schema = {}
  var params = validProps.params
  var propKeys = Object.keys(params)
  propKeys.forEach(function (key) {
    // skip location, children, material and id params
    if (params[key].skipInAframe || key === 'materials') return
    // map defaults to aframe schema convention
    var paramType = params[key].aframeType || params[key].type
    schema[key] = {type: paramType}
    if (params[key].defaultValue) schema[key].default = params[key].defaultValue
    if (params[key].possibleValues) schema[key].oneOf = params[key].possibleValues
  })
  return schema
}

export default getSchema