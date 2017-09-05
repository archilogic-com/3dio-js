export default  {
  params: {
    h: { // height in meters
      type: 'number',
      optional: false,
      min: 0.01 // 1cm
    },
    polygon: {
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      optional: false
    },
    hasCeiling: { // in meters
      type: 'boolean',
      optional: false
    },
    hCeiling: { // in meters
      type: 'number',
      optional: false
    },
    usage: { // in meters
      type: 'string',
      optional: true
    }
  },
  possibleChildrenTypes: []
}
