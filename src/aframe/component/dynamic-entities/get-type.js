import closetType from './by-type/closet'
import doorType from './by-type/door'
import floorType from './by-type/floor'
import kitchenType from './by-type/kitchen'
import polyFloorType from './by-type/polyfloor'
import windowType from './by-type/window'
import wallType from './by-type/wall'

// map el3d modules
var types = {
  // 'box': boxType,
  'closet': closetType,
  // 'curtain': curtainType,
  'door': doorType,
  'floor': floorType,
  'kitchen': kitchenType,
  'polyfloor': polyFloorType,
  // 'stairs': stairsType,
  'wall': wallType,
  'window': windowType
}

export default {
  init: function (attributes) {
    attributes = attributes || {}
    this.a = attributes
  },
  get: function (type) {
    return types[type]
  }
}