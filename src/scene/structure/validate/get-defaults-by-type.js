// import sceneStructure types
import generic from './generic'
import box from './by-type/box.js'
import cameraBookmark from './by-type/camera-bookmark.js'
import closet from './by-type/closet.js'
import column from './by-type/column.js'
import curtain from './by-type/curtain.js'
import door from './by-type/door.js'
import floor from './by-type/floor.js'
import floorplan from './by-type/floorplan.js'
import group from './by-type/group'
import interior from './by-type/interior'
import kitchen from './by-type/kitchen.js'
import level from './by-type/level.js'
import object from './by-type/object.js'
import plan from './by-type/plan.js'
import polybox from './by-type/polybox.js'
import polyfloor from './by-type/polyfloor.js'
import railing from './by-type/railing.js'
import stairs from './by-type/stairs.js'
import tag from './by-type/tag.js'
import wall from './by-type/wall.js'
import window from './by-type/window.js'

import defaults from 'lodash/defaults'

export default function getDefaultsByType (type) {
  var types = {
    box: box,
    'camera-bookmark': cameraBookmark,
    closet: closet,
    column: column,
    curtain: curtain,
    door: door,
    floor: floor,
    floorplan: floorplan,
    group: group,
    interior: interior,
    kitchen: kitchen,
    level: level,
    object: object,
    plan: plan,
    polybox: polybox,
    polyfloor: polyfloor,
    railing: railing,
    stairs: stairs,
    tag: tag,
    wall: wall,
    window: window
  }

  if (type && types[type]) {
    return {
      params: defaults({}, generic.params, types[type].params),
      childrenTypes: types[type].childrenTypes
    }
  } else {
    var typeSpecificValidations = {}

    Object.keys(types).forEach(function (key) {
      generic.type = key
      typeSpecificValidations[key] = {
        params: defaults({}, generic.params, types[key].params),
        childrenTypes: types[key].childrenTypes
      }
    })
    return typeSpecificValidations
  }
}



