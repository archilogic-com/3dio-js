export default {
  params: {
    src: {
      type: 'string',
      optional: false,
      skipInAframe: true
    }
  },
  childrenTypes: ['interior', 'object', 'tag'],
  parentTypes: ['level', 'group', 'interior'],
  aframeComponent: {
    name: 'io3d-furniture'
  }
}