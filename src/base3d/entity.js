// utils
import { generateUuid } from '../utils/uuid.js'
// methods
import add        from './entity/add.js'
import destroy    from './entity/destroy.js'
import find       from './entity/find.js'
import findFirst  from './entity/find-first.js'
import on         from './entity/on.js'
import remove     from './entity/remove.js'


/**
 * @memeberof base3d
 * @class base3d.Entity
 */

export default function Entity () {
  // Avoid direct this references (= less bugs and ES2015 compatible)
  var this_ = this

  this_.uuid = generateUuid()

  // Flags
  this_.initialized = true

}

// methods

Entity.prototype.add = add
Entity.prototype.destroy = destroy
Entity.prototype.find = find
Entity.prototype.findFirst = findFirst
Entity.prototype.on = on
Entity.prototype.remove = remove