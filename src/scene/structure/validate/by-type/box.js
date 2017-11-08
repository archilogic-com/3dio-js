export default {
  params: {
    l: { // length in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    w: { // width in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01, // 1cm
      description: 'width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01, // 1cm
      description: 'height'
    }
  },
  possibleChildrenTypes: [],
  aframeComponent: {
    name: 'io3d-box'
  }
}