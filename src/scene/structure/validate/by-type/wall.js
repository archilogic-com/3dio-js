export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 0.15,
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
      defaultValue: 1,
      optional: false,
      min: 0.01
    },
    baseHeight: {type: 'number', optional: true, defaultValue: 0},
    frontHasBase: {type: 'boolean', optional: true, defaultValue: false},
    backHasBase: {type: 'boolean', optional: true, defaultValue: false}
  },
  childrenTypes: ['window', 'door'],
  parentTypes: ['level', 'group'],
  aframeComponent: {
    name: 'io3d-wall'
  }
}