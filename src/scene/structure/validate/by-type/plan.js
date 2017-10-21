export default  {
  params: {
    modelDisplayName: {
      type: 'string',
      optional: false,
      skipInAframe: true
    },
    v: {
      type: 'number',
      possibleValues: [1],
      optional: false,
      skipInAframe: true
    }
  },
  possibleChildrenTypes: ['level', 'camera-bookmark']
}