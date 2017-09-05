export default {
  params: {
    type: {
      type: 'string',
      possibleValues: ['plan', 'level', 'box', 'wall', 'interior', 'group', 'railing', 'window', 'door', 'floor', 'polyfloor', 'floorplan'],
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
