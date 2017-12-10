export default {
  params: {
    type: {
      type: 'string',
      possibleValues: [
        'box',
        'camera-bookmark',
        'closet',
        'column',
        'curtain',
        'door',
        'floor',
        'floorplan',
        'group',
        'interior',
        'kitchen',
        'level',
        'object',
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
      optional: false,
      skipInAframe: true
    },
    y: { // y position in meters
      type: 'number',
      defaultValue: 0,
      optional: false,
      skipInAframe: true
    },
    z: { // z position in meters
      type: 'number',
      defaultValue: 0,
      optional: false,
      skipInAframe: true
    },
    ry: { // y rotation in angle degrees
      type: 'number',
      defaultValue: 0,
      optional: false,
      skipInAframe: true,
      description: 'rotation around y axis'
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
      optional: false,
      skipInAframe: true,
      description: 'unique identifier: UUID v4'
    },
    materials: {
      type: 'object',
      optional: true
    }
  }
}
