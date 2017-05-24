import './base3d/bootstrap.js'

import Entity from './base3d/entity.js'
import runtime from './base3d/runtime.js'
import { generateUuid, validateUuid } from './utils/uuid.js'

/**
 * @description base3d library object
 * @namespace base3d
 * */
var base3d = {
  Entity: Entity,
  sessionId: runtime.sessionId,
  registerPlugin: runtime.registerPlugin,
  utils: {
    generateUuid: generateUuid,
    validateUuid: validateUuid
  }
}

console.log(base3d)

export default base3d