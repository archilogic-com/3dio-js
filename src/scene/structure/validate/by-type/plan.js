export default  {
  description: 'highest node in hierarchy, contains levels',
  params: {
    modelDisplayName: {
      type: 'string',
      optional: false,
      skipInAframe: true,
      description: 'name of the scene'
    },
    v: {
      type: 'number',
      possibleValues: [1],
      optional: false,
      skipInAframe: true,
      description: 'version'
    }
  },
  childrenTypes: ['level', 'camera-bookmark'],
  parentTypes: []
}