import { version } from '../package.json'
import './base-query/bootstrap.js'

import Entity from './base-query/entity.js'
import runtime from './base-query/runtime.js'
import { generateUuid, validateUuid } from './utils/uuid.js'

/**
 * @description base-query library object
 * @namespace bq
 * */
var bq = {
  // info
  version: version,
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

export default bq