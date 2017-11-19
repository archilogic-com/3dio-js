export default {
  params: {
    l: { // diameter
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01,
      description: 'Length / Diameter'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      min: 0.01,
      description: 'Height'
    },
    shape: {
      type: 'string',
      defaultValue: 'square',
      optional: false,
      min: 0.01,
      possibleValues: ['square', 'circle'],
      description: 'Column contour'
    }
  },
  childrenTypes: [],
  parentTypes: [
    'level',
    'group'
  ]
}