export default {
  params: {
    type: {
      type: 'string',
      possibleValues: [
        'box',
        'camera-bookmark',
        'closet',
        'curtain',
        'door',
        'floor',
        'floorplan',
        'group',
        'interior',
        'kitchen',
        'level',
        'plan',
        'polybox',
        'polyfloor',
        'railing',
        'stairs',
        'tag',
        'wall',
        'window',
      ],
      optional: false
    },
    x: { // x position in meters
      type: 'number',
      defaultValue: 0,
      optional: true
    },
    y: { // y position in meters
      type: 'number',
      defaultValue: 0,
      optional: true
    },
    z: { // z position in meters
      type: 'number',
      defaultValue: 0,
      optional: true
    },
    ry: { // y rotation in angle degrees
      type: 'number',
      defaultValue: 0,
      optional: true
    },
    children: {
      //type: 'array-with-objects',
      type: 'array',
      defaultValue: [],
      optional: true
    },
    id: {
      type: 'string',
      optional: true
    }
  }
}
