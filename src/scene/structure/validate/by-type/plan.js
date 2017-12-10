export default  {
  description: 'highest node in hierarchy, contains levels',
  params: {
    modelDisplayName: {
      type: 'string',
      optional: true,
      skipInAframe: true,
      description: 'name of the scene'
    },
    v: {
      type: 'number',
      defaultValue: 1,
      optional: true,
      skipInAframe: true,
      description: 'version'
    }
  },
  childrenTypes: ['level', 'camera-bookmark'],
  parentTypes: []
}