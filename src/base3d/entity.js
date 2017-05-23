/**
 * @memberof Base3d
 * @namespace entity
 */
export default function Entity (app) {
  // Avoid direct this references (= less bugs and ES2015 compatible)
  var this_ = this

  this_.app = app

}

/**
 * ...
 * @memberof Base3d
 * @function entity#find
 * @param   {object}                          args
 * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
 * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
 * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
 * @returns {Promise}
 */
Entity.prototype.find = function find () {
  console.log('Found nothing')
}

/**
 * ...
 * @memberof Base3d
 * @function entity#findFirst
 * @param   {object}                          args
 * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
 * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
 * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
 * @returns {Promise}
 */
Entity.prototype.findFirst = function find () {
  console.log('Found nothing')
}