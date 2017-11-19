export default {
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 0.05,
      optional: false,
      min: 0.01,
      description: 'Width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01,
      description: 'Height'
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01,
      description: 'Length'
    },
    pailing: {
      type: 'number',
      defaultValue: 0.01,
      optional: false,
      description: 'Strength of the posts'
    },
    railCount: {
      type: 'int',
      defaultValue: 2,
      optional: true,
      description: 'Horizontal rail count'
    },
    segmentation: {
      type: 'string',
      defaultValue: 'distance',
      possibleValues: ['distance', 'number', 'none'],
      optional: false,
      description: 'Vertical segmentation type'
    },
    segments: {
      type: 'int',
      defaultValue: 5,
      optional: true,
      description: 'Number of vertical segments, for segmentation = \'number\''
    },
    segmentDistance: {
      type: 'number',
      defaultValue: 0.14,
      optional: true,
      description: 'Distance between vertical segments, for segmentation = \'distance\''
    }
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-railing'
  }
}
