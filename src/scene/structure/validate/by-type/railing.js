export default {
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
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-railing'
  }
}
