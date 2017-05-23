export default function initStorage (app) {

  /**
   * @memberof Base3d
   * @namespace storage
   */
  var storage = {}

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
  storage.save = function save () {
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
  storage.load = function load () {
    console.log('Found nothing')
  }

  return storage

}