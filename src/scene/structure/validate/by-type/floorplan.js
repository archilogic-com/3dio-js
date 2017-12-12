export default  {
  description: 'reference to a floor plan image',
  params: {
    v: {
      type: 'number',
      defaultValue: 0,
      optional: true,
      description: 'version'
    },
    w: { // width in meters
      type: 'number',
      optional: false,
      min: 0.01
    },
    l: { // length in meters
      type: 'number',
      optional: false,
      min: 0.01
    },
    file: {
      type: 'string',
      optional: false
    }
  },
  childrenTypes: [],
  parentTypes: ['level']
}