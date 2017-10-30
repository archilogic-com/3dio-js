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
    cabinetType: {
      type: 'string',
      defaultValue: 'flat',
      optional: true,
      possibleValues: ['flat', 'style1', 'style2']
    },
    sinkType: {
      type: 'string',
      defaultValue: 'none',
      optional: true,
      possibleValues: ['single', 'double', 'none']
    },
    extractorType: {
      type: 'string',
      defaultValue: 'none',
      optional: true,
      possibleValues: ['box', 'pyramid', 'integrated', 'none']
    },
    ovenType: {
      type: 'string',
      defaultValue: 'none',
      optional: true,
      possibleValues: ['single', 'double', 'none']
    },
    cooktopType: {
      type: 'string',
      defaultValue: 'none',
      optional: true,
      possibleValues: ['electro60', 'electro90', 'none']
    }
    // TODO: add all the default values
  },
  possibleChildrenTypes: []
}
