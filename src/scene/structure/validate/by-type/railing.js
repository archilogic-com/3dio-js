export default {
  description: 'segmented or solid railing',
  params: {
    w: { // width in meters
      type: 'number',
      defaultValue: 0.05,
      optional: false,
      min: 0.01,
      description: 'width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    pailing: {
      type: 'number',
      defaultValue: 0.01,
      optional: false,
      description: 'strength of the posts'
    },
    railCount: {
      type: 'int',
      defaultValue: 2,
      optional: true,
      description: 'horizontal rail count'
    },
    segmentation: {
      type: 'string',
      defaultValue: 'distance',
      possibleValues: ['distance', 'number', 'none'],
      optional: false,
      description: 'vertical segmentation type'
    },
    segments: {
      type: 'int',
      defaultValue: 5,
      optional: true,
      description: 'number of vertical segments, for segmentation = \'number\''
    },
    segmentDistance: {
      type: 'number',
      defaultValue: 0.14,
      optional: true,
      description: 'distance between vertical segments, for segmentation = \'distance\''
    }
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-railing'
  }
}
