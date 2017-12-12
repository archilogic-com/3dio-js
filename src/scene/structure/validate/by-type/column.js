export default {
  description: 'simple structural column object, round or square',
  params: {
    v: {
      type: 'number',
      defaultValue: 1,
      optional: true,
      description: 'version'
    },
    l: { // diameter
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01,
      description: 'length for square / diameter for circle'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    shape: {
      type: 'string',
      defaultValue: 'square',
      optional: false,
      min: 0.01,
      possibleValues: ['square', 'circle'],
      description: 'column contour'
    }
  },
  childrenTypes: [],
  parentTypes: [
    'level',
    'group'
  ],
  aframeComponent: {
    name: 'io3d-column'
  }
}