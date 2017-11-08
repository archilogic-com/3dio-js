export default {
  params: {
    object: {
      type: 'string',
      optional: false,
      skipInAframe: true
    },
    sourceScale: {
      type: 'number',
      optional: true,
      skipInAframe: true
    }
  },
  childrenTypes: ['interior'],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-data3d'
  }
}