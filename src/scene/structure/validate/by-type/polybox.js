export default  {
  params: {
    h: { // height in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01 // 1cm
    },
    polygon: {
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      optional: false
    }
  },
  possibleChildrenTypes: []
}
