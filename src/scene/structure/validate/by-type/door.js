export default {
  description: 'door within a wall',
  params: {
    v: {
      type: 'number',
      defaultValue: 3,
      possibleValues: [3],
      optional: false,
      description: 'version'
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 0.9,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    w: { // width in meters
      type: 'number',
      defaultValue: 0.05,
      optional: false,
      min: 0.01,
      description: 'width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    frameLength: { // in meters
      type: 'number',
      defaultValue: 0.05,
      optional: true,
      min: 0.01,
      description: 'thickness of frame'
    },
    frameOffset: { // in meters
      type: 'number',
      defaultValue: 0,
      optional: true,
      description: 'frame thicker than wall'
    },
    leafWidth: { // in meters
      type: 'number',
      defaultValue: 0.03,
      optional: true,
      description: 'thickness of door leaf'
    },
    leafOffset: { // in meters
      type: 'number',
      defaultValue: 0.005,
      optional: true,
      description: 'z offset of door leaf'
    },
    doorType: {
      type: 'string',
      defaultValue: 'singleSwing',
      optional: false,
      possibleValues: ['singleSwing', 'doubleSwing', 'swingFix', 'swingDoubleFix', 'doubleSwingDoubleFix', 'slidingDoor', 'opening'],
      description: 'defines opening type'
    },
    hinge: {
      type: 'string',
      defaultValue: 'right',
      optional: false,
      possibleValues: ['right', 'left'],
      description: 'door leaf opening direction'
    },
    side: {
      type: 'string',
      defaultValue: 'back',
      optional: false,
      possibleValues: ['front', 'back'],
      description: 'door leaf opening to the front or back of the wall'
    },
    doorAngle: { // in angle degrees
      type: 'number',
      defaultValue: 92,
      optional: true,
      description: 'door leaf opening anlge'
    },
    fixLeafRatio: { // in meters
      type: 'number',
      defaultValue: 0.3,
      optional: true
    },
    threshold: {
      type: 'boolean',
      defaultValue: true
    },
    thresholdHeight: {
      type: 'number',
      defaultValue: 0.01,
      optional: true
    }
  },
  childrenTypes: [],
  parentTypes: ['wall'],
  aframeComponent: {
    name: 'io3d-door'
  }
}