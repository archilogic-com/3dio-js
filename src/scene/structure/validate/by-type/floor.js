export default  {
  params: {
    w: { // width in meters
      type: 'number',
      optional: false,
      min: 0.01 // 1cm
    },
    h: { // height in meters
      type: 'number',
      optional: false,
      min: 0.01 // 1cm
    },
    l: { // length in meters
      type: 'number',
      optional: false,
      min: 0.01
    },
    hasCeiling: { // in meters
      type: 'boolean',
      optional: false
    },
    hCeiling: { // in meters
      type: 'number',
      optional: false
    }
  },
  possibleChildrenTypes: []
}