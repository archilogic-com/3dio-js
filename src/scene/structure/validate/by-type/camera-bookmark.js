export default {
  description: 'preset camera positions for animations and navigation',
  params: {
    distance: {
      type: 'number',
      skipInAframe: true
    },
    fov: {
      type: 'number',
      defaultValue: 71,
      skipInAframe: true
    }
  },
  parentTypes: ['plan'],
  aframeComponent: {
    name: 'tour-waypoint'
  }
}