export default {
  description: 'window with optional segmentation',
  params: {
    y: {
      defaultValue: 0.8,
    },
    h: {
      type: 'number',
      defaultValue: 1.5,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    l: {
      type: 'number',
      defaultValue: 1.6,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    side: {
      type: 'string',
      defaultValue: 'back',
      optional: true,
      possibleValues: ['back', 'center', 'front'],
      description: 'relative position of the window inside the wall opening'
    },
    rowRatios: {
      //type: 'array-with-numbers',
      type: 'array',
      defaultValue: [ 1 ],
      aframeDefault: '[1]',
      optional: true,
      description: 'relative height of horizontal segmentation',
      parse: function(val) {
        if (!/^\[.+\]/.test(val)) {
          console.warn('invalid input for window rowRatios')
          return [ 1 ]
        }
        return JSON.parse(val)
      }
    },
    columnRatios: {
      //type: 'array-with-arrays-with-numbers',
      type: 'array',
      defaultValue: [ [ 1 ] ],
      aframeDefault: '[[1]]',
      optional: true,
      description: 'relative width of vertical segmentation per row',
      parse: function(val) {
        if (!/^\[\s*\[.+\]\s*\]/.test(val)) {
          console.warn('invalid input for window columnRatios')
          return [ [ 1 ] ]
        }
        return JSON.parse(val)
      }
    },
    frameLength: {
      type: 'number',
      defaultValue: 0.04,
      optional: true,
      min: 0.01,
      description: 'thickness of the frame'
    },
    frameWidth: {
      type: 'number',
      defaultValue: 0.06,
      optional: true,
      min: 0.01,
      description: 'width of the frame'
    },
    hideGlass: {
      type: 'boolean',
      defaultValue: false,
      optional: true,
      description: 'Hides glass mesh'
    }
  },
  childrenTypes: [],
  parentTypes: ['wall'],
  aframeComponent: {
    name: 'io3d-window'
  }
}