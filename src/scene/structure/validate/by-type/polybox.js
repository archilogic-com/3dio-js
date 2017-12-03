export default  {
  description: 'polygonal extrusion object',
  params: {
    h: { // height in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01 // 1cm
    },
    polygon: {
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      aframeType: 'string',
      optional: false
    }
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-polybox'
  }
}
