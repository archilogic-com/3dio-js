export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01 // 1cm
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      min: 0.01 // 1cm
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1.8,
      optional: false,
      min: 0.01
    },
    folds: {
      type: 'number',
      defaultValue: 14,
      optional: true,
      min: 0.01
    }
  },
  possibleChildrenTypes: []
}