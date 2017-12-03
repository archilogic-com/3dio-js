export default {
  description: 'parametric kitchen with vast configuration options',
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
    l: {
      type: 'number',
      defaultValue: 4.2,
      optional: false,
      min: 0.01
    },
    elementLength: {
      type: 'number',
      defaultValue: 0.6,
      optional: false,
      min: 0.01
    },
    baseBoard: {
      type: 'number',
      defaultValue: 0.1,
      optional: true,
      min: 0.01
    },
    counterHeight: {
      type: 'number',
      defaultValue: 0.9,
      optional: true,
      min: 0.01
    },
    counterThickness: {
      type: 'number',
      defaultValue: 0.03,
      optional: true,
      min: 0.01
    },
    barCounter: {
      type: 'boolean',
      defaultValue: false,
      optional: true
    },
    doorWidth: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01
    },
    highCabinetLeft: {
      type: 'int',
      defaultValue: 2,
      optional: true
    },
    highCabinetRight: {
      type: 'int',
      defaultValue: 0,
      optional: true
    },
    wallCabinet: {
      type: 'boolean',
      defaultValue: true,
      optional: true
    },
    wallCabinetHeight: {
      type: 'number',
      defaultValue: 1.5,
      optional: true,
      min: 0.01
    },
    wallCabinetWidth: {
      type: 'number',
      defaultValue: 0.45,
      optional: true,
      min: 0.01
    },
    cabinetType: {
      type: 'string',
      defaultValue: 'flat',
      optional: true,
      possibleValues: ['flat', 'style1', 'style2']
    },
    sinkType: {
      type: 'string',
      defaultValue: 'single',
      optional: true,
      possibleValues: ['single', 'double', 'none']
    },
    sinkPos: {
      type: 'int',
      defaultValue: 4,
      optional: true
    },
    extractorType: {
      type: 'string',
      defaultValue: 'integrated',
      optional: true,
      possibleValues: ['box', 'pyramid', 'integrated', 'none']
    },
    ovenType: {
      type: 'string',
      defaultValue: 'single',
      optional: true,
      possibleValues: ['single', 'double', 'none']
    },
    ovenPos: {
      type: 'int',
      defaultValue: 6,
      optional: true
    },
    cooktopType: {
      type: 'string',
      defaultValue: 'electro60',
      optional: true,
      possibleValues: [
        'electro60',
        'electro90',
        'gas60',
        'gas90',
        'none'
      ]
    },
    cooktopPos: {
      type: 'int',
      defaultValue: 6,
      optional: true
    },
    microwave: {
      type: 'boolean',
      defaultValue: false,
      optional: true
    },
    microwavePos: {
      type: 'int',
      defaultValue: 1,
      optional: true
    },
    fridge: {
      type: 'boolean',
      defaultValue: false,
      optional: true
    },
    fridgePos: {
      type: 'int',
      defaultValue: 1,
      optional: true
    }
    // TODO: add all the default values
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-kitchen'
  }
}
