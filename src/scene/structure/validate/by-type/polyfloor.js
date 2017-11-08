export default {
  params: {
    h: { // height in meters
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01, // 1cm
      description: 'height'
    },
    polygon: {
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      // aframeType: 'string',
      defaultValue: [[1.5,1.5], [1.5,-1.5], [-1.5,-1.5], [-1.5,1.5]],
      aframeDefault: [ 1.5,1.5,1.5,-1.5,-1.5,-1.5,-1.5,1.5 ],
      optional: false,
      description: 'outer polygon'
    },
    polygonHoles: {
      type: 'array',
      optional: true,
      description: 'polygon holes'
    },
    hasCeiling: { // in meters
      type: 'boolean',
      defaultValue: true,
      optional: false,
      description: 'toggle ceiling'
    },
    hCeiling: { // in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      description: 'ceiling height'
    },
    usage: { // in meters
      type: 'string',
      optional: true
    }
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-polyfloor'
  }
}
