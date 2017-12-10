export default {
  description: 'preset camera positions for animations and navigation',
  params: {
    rx: {
      type: 'number',
      defaultValue: 0,
      skipInAframe: true,
      description: 'pitch'
    },
    distance: {
      type: 'number',
      skipInAframe: true
    },
    fov: {
      type: 'number',
      defaultValue: 71,
      skipInAframe: true
    },
    name: {
      type: 'string',
      defaultValue: 'Camera Bookmark'
    }
  },
  parentTypes: ['plan'],
  aframeComponent: {
    name: 'tour-waypoint'
  }
}