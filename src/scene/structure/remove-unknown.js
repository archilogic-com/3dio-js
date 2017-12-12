import getDefaultsByType from './validate/get-defaults-by-type.js'

export default function removeUnknown(element3d) {
  var knownParameters = getDefaultsByType()
  // remove invalid types entirely
  if (!knownParameters[element3d.type]) return

  var params = knownParameters[element3d.type].params
  var possibleChildren = knownParameters[element3d.type].childrenTypes
  // remove invalid params
  Object.keys(element3d).forEach(function(key) {
    if (!params[key]) {
      delete element3d[key]
    }
  })
  // remove invalid children
  if (element3d.children && element3d.children.length) {
    element3d.children = element3d.children.filter(function(child) {
      return possibleChildren.indexOf(child.type) > -1
    })
  }
  return element3d
}