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
      // aframeType: 'string',
      defaultValue: [ 1.5,1.5,1.5,-1.5,-1.5,-1.5,-1.5,1.5 ],
      optional: false
    },
    hasCeiling: { // in meters
      type: 'boolean',
      defaultValue: true,
      optional: false
    },
    hCeiling: { // in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false
    },
    usage: { // in meters
      type: 'string',
      optional: true
    }
  },
  possibleChildrenTypes: []
}
