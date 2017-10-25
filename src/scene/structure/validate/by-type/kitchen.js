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
      type: 'number',
      defaultValue: 2,
      optional: true
    },
    highCabinetRight: {
      type: 'number',
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
      optional: true
    },
    sinkType: {
      type: 'string',
      defaultValue: 'none',
      optional: true
    },
    extractorType: {
      type: 'string',
      defaultValue: 'none',
      optional: true
    },
    ovenType: {
      type: 'string',
      defaultValue: 'none',
      optional: true
    },
    cooktopType: {
      type: 'string',
      defaultValue: 'none',
      optional: true
    }
    // TODO: add all the default values
  },
  possibleChildrenTypes: []
}
