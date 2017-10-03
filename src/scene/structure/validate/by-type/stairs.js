export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 1.2,
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
      defaultValue: 4,
      optional: false,
      min: 0.01
    },
    stepWidth: {
      type: 'number',
      defaultValue: 1.2,
      optional: true,
      min: 0.01
    },
    stairType: {
      type: 'string',
      defaultValue: 'straight',
      optional: true,
      min: 0.01
    }
    // TODO: add all default values
  },
  possibleChildrenTypes: []
}
