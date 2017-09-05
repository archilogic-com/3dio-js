import callService  from '../utils/services/call.js'

export default function placeFurnishings (args) {
  console.log('placing things', args)
  var floorIds = Object.keys(args)
  // pick first floor & first result
  var promises = []
  floorIds.forEach(function(id) {
    var groups = args[id][0].groups
    groups.forEach(g => {
      promises.push(getGroup({modelStructure: g}))
    })
  })
  return Promise.all(promises)
}

function getGroup(args) {
  var id = args.id || args.modelStructure.src && args.modelStructure.src.substring(1)
  var group
  return callService('Product.read', { arguments: id})
    .then(product => {
      if (product.categories.indexOf('group') < -1) return
      var ms = JSON.parse(product.modelStructure)
      console.log(ms, ms.type)
      var modelStructure = args.modelStructure || ms
      var position = {x: modelStructure.x, y: modelStructure.y, z: modelStructure.z}
      var rotation = modelStructure.ry
      // product groups
      if (ms.type === 'group' && ms.children) {
        group = addEntity({ position, rotation })
        ms.children.forEach(c => {
          if (c.type === 'interior') {
          var position = {x: c.x, y: c.y, z: c.z}
          var rotation = c.ry
          var el = addEntity({key: 'io3d-furniture', id: c.src.substring(1), position, rotation, parent:group})
        }
      })
        // single products
      } else if (ms.type === 'interior') group = addEntity({key: 'io3d-furniture', id: product.productResourceId, position, rotation})
      return group
    })
}

function addEntity(args) {
  var
    position = args.position || {x: 0, y: 0, z: 0},
    ry = args.rotation || 0,
    id = args.id,
    tag = args.tag || 'a-entity',
    key = args.key,
    parent = args.parent || document.querySelector("a-scene"),
    attributes = args.attributes || {}

  attributes.position = position.x + ' ' + position.y + ' ' + position.z
  attributes.rotation = '0 ' + ry + ' 0'
  if (key === 'io3d-furniture' && id) {
    attributes[key] = 'id:' + id
    attributes.productId = id
  }
  else if (key === 'io3d-data3d' && id) attributes[key] = 'key:' + id + '; lightMapExposure: 0.8: lightMapIntensity: 1.0;'
  var el = document.createElement(tag)
  Object.keys(attributes).forEach(key => {
    el.setAttribute(key, attributes[key])
  })
  if (args.class) {
    if (el.classList) el.classList.add(args.class)
    else el.className += " " + args.class
  }
  if (parent) return parent.appendChild(el)
  else console.log('no parent', attributes.id)
}