var PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Generate an UUID as specified in RFC4122
 * @memberof Base3d
 * @function utils#generateUuid
 */

export function generateUuid () {
  var d = Date.now()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  })
  return uuid
}

/**
 * Validates UUID as specified in RFC4122
 * @memberof Base3d
 * @function utils#validateUuid
 */

export function validateUuid (str) {
  if (!str || typeof str !== "string") return false
  return PATTERN.test(str)
}
