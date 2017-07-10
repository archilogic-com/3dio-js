const BASE = require('../../build/base-query.js')
const resourceId = process.argv.pop()
const ALLOWED_TYPES = [
  'level',
  'group',
  'floor',
  'polyfloor',
  'wall',
  'window',
  'door',
  'interior',
  'object'
]

function getBaseParameters(node) {
  switch(node.type) {
    case 'floor':
    case 'polyfloor':
      return `base-floor="polygon: ${JSON.stringify(node.polygon)}"`
    case 'interior':
      return `base-product="id:${node.src.slice(1)}"`
    case 'object':
      return `base-data3d="key:${node.object}"`
  }
  return ''
}

function parseNode(node) {
  let children = ''
  if(node.children && node.children.length > 0) {
    children = node.children
      .filter((child) => ALLOWED_TYPES.includes(child.type))
      .map(parseNode)
      .join('\n')
  }

  const scale = node.sourceScale || 1
  let componentString = `<a-entity ${getBaseParameters(node)} position="${node.x || 0} ${node.y || 0} ${node.z || 0}" rotation="${node.rx || 0} ${node.ry || 0} 0" scale="${scale} ${scale} ${scale}" data-type="${node.type}">${children}</a-entity>`
  return componentString
}
BASE.services.call('Model.read', {arguments: { resourceId }})
  .then((modelData) => modelData.modelStructure.children)
  .then((children) => {

    const scene = children
      .filter((child) => ALLOWED_TYPES.includes(child.type))
      .map(parseNode)
      .join('\n')

    console.log(scene)
  })