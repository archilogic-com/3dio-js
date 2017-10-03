export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 0.6,
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
    baseboard: {
      type: 'number',
      defaultValue: 0.1,
      optional: true,
      min: 0.01
    },
    doorWidth: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01
    },
    handleLength: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01
    },
    handleWidth: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01
    },
    handleHeight: {
      type: 'number',
      defaultValue: 0.3,
      optional: true,
      min: 0.01
    }
  },
  possibleChildrenTypes: []
}