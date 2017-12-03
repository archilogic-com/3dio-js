export default {
  description: 'referenced 3d object in data3d.buffer format, for conversion drop a .obj into the editor spaces.archilogic.com/3d',
  params: {
    object: {
      type: 'string',
      optional: false,
      skipInAframe: true,
      description: 'reference to data3d.buffer file'
    },
    sourceScale: {
      type: 'number',
      optional: true,
      skipInAframe: true,
      description: 'relative scale of source file to 1 meter'
    },
    flipYZ: {
      type: 'boolean',
      optional: true,
      skipInAframe: true,
      description: 'flip Y and Z Axis'
    }
  },
  childrenTypes: ['interior'],
  parentTypes: ['level'],
  aframeComponent: {
    name: 'io3d-data3d'
  }
}