export default {
  description: 'curtain with random folds',
  params: {
    v: {
      type: 'number',
      defaultValue: 1,
      optional: true,
      description: 'version'
    },
    l: { // length in meters
      type: 'number',
      defaultValue: 1.8,
      optional: false,
      min: 0.01,
      description: 'length'
    },
    w: { // width in meters
      type: 'number',
      defaultValue: 0.2,
      optional: false,
      min: 0.01,
      description: 'thickness'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    folds: {
      type: 'number',
      defaultValue: 14,
      optional: true,
      min: 0.01,
      description: 'number of folds'
    }
  },
  childrenTypes: [],
  parentTypes: ['level']
}