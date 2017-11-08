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
  childrenTypes: ['level', 'camera-bookmark'],
  parentTypes: []
}