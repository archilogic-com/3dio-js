/**
 * @memberof Base3d
 * @namespace storage
 */
export default function Storage (app) {
  // Avoid direct this references (= less bugs and ES2015 compatible)
  var this_ = this

  this_.app = app

}

/**
 * ...
 * @memberof Base3d
 * @function storage#save
 * @param   {object}                          args
 * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
 * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
 * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
 * @returns {Promise}
 */
Storage.prototype.save = function save () {
  console.log('Found nothing')
}

/**
 * ...
 * @memberof Base3d
 * @function storage#load
 * @param   {object}                          args
 * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
 * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
 * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
 * @returns {Promise}
 */
Storage.prototype.load = function load () {
  console.log('Found nothing')
}