export default {
  params: {
    y: {
      defaultValue: 0.8,
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 1.5,
      optional: false,
      min: 0.01 // 1cm
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1.6,
      optional: false,
      min: 0.01
    },
    rowRatios: { // in meters
      //type: 'array-with-numbers',
      type: 'array',
      skipInAframe: true,
      optional: true
    },
    columnRatios: { // in meters
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      skipInAframe: true,
      optional: true
    },
    frameLength: { // in meters
      type: 'number',
      defaultValue: 0.04,
      optional: true,
      min: 0.01
    },
    frameWidth: { // in meters
      type: 'number',
      defaultValue: 0.06,
      optional: true,
      min: 0.01
    }
  },
  possibleChildrenTypes: [],
  aframeComponent: {
    name: 'io3d-window'
  }
}