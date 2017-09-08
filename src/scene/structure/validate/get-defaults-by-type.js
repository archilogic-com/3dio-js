// import sceneStructure types
import generic from './generic'
import box from './by-type/box.js'
import cameraBookmark from './by-type/camera-bookmark.js'
import door from './by-type/door.js'
import floor from './by-type/floor.js'
import floorplan from './by-type/floorplan.js'
import group from './by-type/group'
import interior from './by-type/interior'
import level from './by-type/level.js'
import plan from './by-type/plan.js'
import polyfloor from './by-type/polyfloor.js'
import railing from './by-type/railing.js'
import wall from './by-type/wall.js'
import window from './by-type/window.js'

import defaults from 'lodash/defaults'

export default function getDefaultsByType() {
  var types = {
    box,
    cameraBookmark,
    door,
    floor,
    floorplan,
    group,
    interior,
    level,
    plan,
    polyfloor,
    railing,
    wall,
    window
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



