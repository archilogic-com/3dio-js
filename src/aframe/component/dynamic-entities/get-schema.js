
function getSchema(type) {
  let args = {}
  validProps[type].forEach(function(prop) {
    if (props[prop]) args[prop] = props[prop]
  })
  return args
}
var validProps = {
  box: ['h', 'l', 'w'],
  closet: ['h', 'l', 'w'],
  curtain: ['h', 'l', 'w'],
  door: ['h', 'l', 'w', 'x', 'y', 'hinge', 'side', 'doorType'],
  floor: ['h', 'l', 'w'],
  kitchen: ['h', 'l', 'w', 'highCabinetLeft', 'highCabinetRight', 'wallCabinet'],
  polyfloor: ['h', 'polygon'],
  stairs: ['h', 'l', 'w'],
  wall: ['h', 'l', 'w'],
  window: ['h', 'l', 'x', 'y']
}
var props = {
  l: {
    type: 'float',
    default: null
  },
  h: {
    type: 'float',
    default: null
  },
  w: {
    type: 'float',
    default: null
  },
  materials: {
    type: 'string',
    default: ''
  },
  polygon: {
    type: 'string',
    default: ''
  },
  hinge: {
    type: 'string',
    default: 'right'
  },
  side: {
    type: 'string',
    default: 'back'
  },
  doorType: {
    type: 'string',
    default: 'singleSwing'
  },
  highCabinetLeft: {
    type: 'number',
    default: 2
  },
  highCabinetRight: {
    type: 'number',
    default: 0
  },
  wallCabinet: {
    type: 'boolean',
    default: true
  }
}

export default {
  get: getSchema,
  validProps: validProps
}