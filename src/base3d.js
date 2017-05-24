import { version, repository } from '../package.json'
import './base3d/bootstrap.js'

import Entity from './base3d/entity.js'
import runtime from './base3d/runtime.js'
import { generateUuid, validateUuid } from './utils/uuid.js'

/**
 * @description base3d library object
 * @namespace base3d
 * */
var base3d = {
  // info
  version: version,
  repository: repository.url,
  sessionId: runtime.sessionId,
  // class
  Entity: Entity,
  // static methods
  registerPlugin: runtime.registerPlugin,
  // utils
  utils: {
    generateUuid: generateUuid,
    validateUuid: validateUuid
  }
}

export default base3d