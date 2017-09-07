import door from './by-type/door.js'
import floor from './by-type/floor.js'
import floorplan from './by-type/floorplan.js'
import level from './by-type/level.js'
import plan from './by-type/plan.js'
import polyfloor from './by-type/polyfloor.js'
import wall from './by-type/wall.js'
import window from './by-type/window.js'
import railing from './by-type/railing.js'
import generic from './generic'
import defaults from 'lodash/defaults'

export default function getDefaultsByType() {
  var types = {
    door,
    floor,
    floorplan,
    level,
    plan,
    polyfloor,
    wall,
    window,
    railing
  }

  var typeSpecificValidations = {}

  Object.keys(types).forEach(key => {
    typeSpecificValidations[key] = {
      params: defaults({}, generic.params, types[key].params),
      possibleChildrenTypes: types[key].possibleChildrenTypes
    }
  })

  return typeSpecificValidations
}



