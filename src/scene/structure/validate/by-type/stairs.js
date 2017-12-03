export default {
  description: 'all kinds of stairs types',
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
      optional: false,
      min: 0.01
    },
    stairType: {
      type: 'string',
      defaultValue: 'straight',
      optional: false,
      possibleValues: ['straight', 'straightLanding', 'lShaped', 'halfLanding', '2QuarterLanding', 'winder', 'doubleWinder', 'spiral']
    },
    treadHeight: {
      type: 'number',
      defaultValue: 0.02,
      optional: false
    },
    stepThickness: {
      type: 'number',
      defaultValue: 0.17,
      optional: false
    },
    railing: {
      type: 'string',
      defaultValue: 'right',
      optional: false,
      possibleValues: ['none', 'left', 'right', 'both']
    },
    railingType: {
      type: 'string',
      defaultValue: 'verticalBars',
      optional: false,
      possibleValues: ['verticalBars']
    }
    // TODO: add all default values
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-stairs'
  }
}
