export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01 // 1cm
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01 // 1cm
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01
    }
  },
  possibleChildrenTypes: []
}