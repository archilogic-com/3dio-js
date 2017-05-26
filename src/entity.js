import { version } from '../package.json'
import runtime from './runtime.js'
// utils
import { generateUuid, validateUuid } from './utils/uuid.js'
// methods
import add        from './entity/add.js'
import destroy    from './entity/destroy.js'
import find       from './entity/find.js'
import findFirst  from './entity/find-first.js'
import on         from './entity/on.js'
import remove     from './entity/remove.js'


/**
 * @memeberof bq
 * @class bq.Entity
 */

export default function Entity () {
  // Avoid direct this references (= less bugs and ES2015 compatible)
  var this_ = this

  this_.uuid = generateUuid()

  // Flags
  this_.initialized = true

}

Entity.Entity = Entity.prototype.Entity = Entity

// static

Entity.version = Entity.prototype.version = version
Entity.registerPlugin = Entity.prototype.registerPlugin = runtime.registerPlugin
Entity.utils = Entity.prototype.utils = {
  generateUuid: generateUuid,
  validateUuid: validateUuid
}

// methods

Entity.prototype.add = add
Entity.prototype.destroy = destroy
Entity.prototype.find = find
Entity.prototype.findFirst = findFirst
Entity.prototype.on = on
Entity.prototype.remove = remove