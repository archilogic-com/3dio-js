export default  {
  description: 'reference to a floor plan image',
  params: {
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