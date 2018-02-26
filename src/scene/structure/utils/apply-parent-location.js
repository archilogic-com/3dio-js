import cloneDeep from 'lodash/cloneDeep'

// apply parent location
export default function applyLocation(element, parent) {
  if (!parent) return element
  var _element = cloneDeep(element)
  var _parent = cloneDeep(parent)

  // fallback to default values if not provided
  const params = ['x', 'y', 'z', 'ry']
  params.forEach(key => {
    if (_element[key] === undefined) _element[key] = 0
    if (_parent[key] === undefined) _parent[key] = 0
  })
  // Rotate element on the XZ plane around parent's center
  var angleY = -parent.ry * Math.PI / 180
  var rotatedX = _element.x * Math.cos(angleY) - _element.z * Math.sin(angleY)
  var rotatedZ = _element.z * Math.cos(angleY) + _element.x * Math.sin(angleY)

  // Get world parent space coordinates for our element
  _element.x = _parent.x + rotatedX
  _element.y += _parent.y
  _element.z = _parent.z + rotatedZ
  _element.ry += _parent.ry
  
  return _element
}