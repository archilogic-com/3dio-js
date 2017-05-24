// methods
import find       from './entity/find.js'
import findFirst  from './entity/find-first.js'
import on         from './entity/on.js'
import add        from './entity/add.js'
// utils
import { generateUuid } from '../utils/uuid.js'

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

Entity.prototype.on = on
Entity.prototype.add = add
Entity.prototype.find = find
Entity.prototype.findFirst = findFirst