export default {
  params: {
    v: {
      type: 'number',
      defaultValue: 3,
      possibleValues: [3],
      optional: false
    },
    w: { // width in meters
      type: 'number',
      defaultValue: 0.05,
      optional: false,
      min: 0.01 // 1cm
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2,
      optional: false,
      min: 0.01 // 1cm
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 0.9,
      optional: false,
      min: 0.01
    },
    frameLength: { // in meters
      type: 'number',
      defaultValue: 0.05,
      optional: true,
      min: 0.01
    },
    frameOffset: { // in meters
      type: 'number',
      defaultValue: 0,
      optional: true
    },
    leafWidth: { // in meters
      type: 'number',
      defaultValue: 0.03,
      optional: true
    },
    leafOffset: { // in meters
      type: 'number',
      defaultValue: 0.005,
      optional: true
    },
    doorType: {
      type: 'string',
      defaultValue: 'singleSwing',
      optional: false,
      possibleValues: ['singleSwing', 'doubleSwing', 'swingFix', 'swingDoubleFix', 'doubleSwingDoubleFix', 'slidingDoor', 'opening']
    },
    fixLeafRatio: { // in meters
      type: 'number',
      defaultValue: 0.3,
      optional: true
    },
    doorAngle: { // in angle degrees
      type: 'number',
      defaultValue: 92,
      optional: true
    },
    hinge: {
      type: 'string',
      defaultValue: 'right',
      optional: false,
      possibleValues: ['right', 'left']
    },
    side: {
      type: 'string',
      defaultValue: 'back',
      optional: false,
      possibleValues: ['front', 'back']
    },
    thresholdHeight: {
      type: 'number',
      defaultValue: 0.01,
      optional: true
    }
  },
  possibleChildrenTypes: []
}