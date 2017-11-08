export default {
  params: {
    src: {
      type: 'string',
      optional: false,
      skipInAframe: true
    }
  },
  possibleChildrenTypes: ['interior', 'object', 'tag'],
  aframeComponent: {
    name: 'io3d-furniture'
  }
}