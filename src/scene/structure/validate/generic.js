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
      optional: false,
      skipInAframe: true
    },
    x: { // x position in meters
      type: 'number',
      defaultValue: 0,
      optional: true,
      skipInAframe: true
    },
    y: { // y position in meters
      type: 'number',
      defaultValue: 0,
      optional: true,
      skipInAframe: true
    },
    z: { // z position in meters
      type: 'number',
      defaultValue: 0,
      optional: true,
      skipInAframe: true
    },
    ry: { // y rotation in angle degrees
      type: 'number',
      defaultValue: 0,
      optional: true,
      skipInAframe: true
    },
    children: {
      //type: 'array-with-objects',
      type: 'array',
      defaultValue: [],
      optional: true,
      skipInAframe: true
    },
    id: {
      type: 'string',
      optional: true,
      skipInAframe: true
    },
    materials: {
      type: 'object',
      optional: true
    }
  }
}
