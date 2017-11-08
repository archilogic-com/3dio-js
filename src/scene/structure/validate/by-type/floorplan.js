export default  {
  params: {
    w: { // width in meters
      type: 'number',
      optional: false,
      min: 0.01 // 1cm
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