export default {
  params: {
    h: { // height in meters
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01 // 1cm
    },
    polygon: {
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      aframeType: 'string',
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
