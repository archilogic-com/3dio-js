export default {
  params: {
    src: {
      type: 'string',
      optional: false,
      skipInAframe: true,
      description: 'furniture id prefixed with \'!\', check https://furniture.3d.io'
    }
  },
  childrenTypes: ['interior', 'object', 'tag'],
  parentTypes: ['level', 'group', 'interior'],
  aframeComponent: {
    name: 'io3d-furniture'
  }
}