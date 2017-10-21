export default {
  params: {
    object: {
      type: 'string',
      optional: false,
      skipInAframe: true
    },
    sourceScale: {
      type: 'number',
      optional: true,
      skipInAframe: true
    }
  },
  possibleChildrenTypes: ['interior']
}