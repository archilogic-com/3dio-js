export default {
  params: {
    h: { // height in meters
      type: 'number',
      defaultValue: 1.5,
      optional: false,
      min: 0.01 // 1cm
    },
    l: { // length in meters
      type: 'number',
      optional: false,
      min: 0.01
    },
    rowRatios: { // in meters
      //type: 'array-with-numbers',
      type: 'array',
      optional: true
    },
    columnRatios: { // in meters
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      optional: true
    },
    frameLength: { // in meters
      type: 'number',
      optional: true,
      min: 0.01
    },
    frameWidth: { // in meters
      type: 'number',
      optional: true,
      min: 0.01
    },
    y: {
      defaultValue: 0.9,
    }
  },
  possibleChildrenTypes: []
}