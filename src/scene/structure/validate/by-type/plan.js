export default  {
  params: {
    modelDisplayName: {
      type: 'string',
      optional: false
    },
    v: {
      type: 'number',
      possibleValues: [1],
      optional: false
    }
  },
  possibleChildrenTypes: ['level']
}