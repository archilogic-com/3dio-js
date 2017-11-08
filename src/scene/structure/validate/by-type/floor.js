export default  {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 4,
      optional: false,
      min: 0.01, // 1cm
      description: 'width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01, // 1cm
      description: 'height'
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 4,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    hasCeiling: { // in meters
      type: 'boolean',
      defaultValue: true,
      optional: false,
      description: 'toggle ceiling'
    },
    hCeiling: { // in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      description: 'ceiling height'
    }
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-floor'
  }
}