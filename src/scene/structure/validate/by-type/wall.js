export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 0.15,
      optional: false,
      min: 0.01,
      description: 'width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    controlLine: {
      type: 'string',
      defaultValue: 'back',
      optional: true,
      possibleValues: ['back', 'center', 'front'],
      description: 'relative position of the control line to the wall'
    },
    baseHeight: {
      type: 'number',
      defaultValue: 0,
      optional: true,
      description: 'height of the baseboard'
    },
    frontHasBase: {
      type: 'boolean',
      defaultValue: false,
      optional: true,
      description: 'show baseboard on the front'
    },
    backHasBase: {
      type: 'boolean',
      defaultValue: false,
      optional: true,
      description: 'show baseboard on the back'
    }
  },
  childrenTypes: [
    'window',
    'door'
  ],
  parentTypes: [
    'level',
    'group'
  ],
  aframeComponent: {
    name: 'io3d-wall'
  }
}