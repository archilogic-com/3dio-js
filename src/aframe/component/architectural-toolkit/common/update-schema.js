export default function updateSchema(newData) {
  var materialProperties = {}
  Object.keys(newData)
    .filter(function (propKey) { return propKey.substr(0, 9) === 'material_' })
    .forEach(function (propKey) {
      materialProperties[propKey] = { type: 'string' }
    })
  this.extendSchema(materialProperties)
}