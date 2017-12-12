export default {
  description: 'parametric closet with segmentation targeting 0.6m',
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
      defaultValue: 0.6,
      optional: false,
      min: 0.01,
      description: 'width'
    },
    h: { // height in meters
      type: 'number',
      defaultValue: 2.4,
      optional: false,
      min: 0.01,
      description: 'height'
    },
    baseboard: {
      type: 'number',
      defaultValue: 0.1,
      optional: true,
      min: 0.01,
      description: 'height of baseboard'
    },
    doorWidth: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01,
      description: 'thickness of closet door'
    },
    handleLength: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01,
      description: 'length of closet door handle'
    },
    handleWidth: {
      type: 'number',
      defaultValue: 0.02,
      optional: true,
      min: 0.01,
      description: 'thickness of closet door handle'
    },
    handleHeight: {
      type: 'number',
      defaultValue: 0.3,
      optional: true,
      min: 0.01,
      description: 'height of closet door handle'
    }
  },
  childrenTypes: [],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-closet'
  }
}
