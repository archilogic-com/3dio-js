export default function initScene () {

  /**
   * @memberof Base3d
   * @namespace scene
   */
  var scene = {}

  /**
   * ...
   * @memberof Base3d
   * @function scene#find
   * @param   {object}                          args
   * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
   * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
   * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
   * @returns {Promise}
   */
  scene.find = function find () {
    console.log('Found nothing')
  }

  /**
   * ...
   * @memberof Base3d
   * @function scene#findFirst
   * @param   {object}                          args
   * @param   {string}                          [args.apiUrl]           - Url of archilogic services server-side endpoints.
   * @param   {string}                          [args.modelMakerApiUrl] - Url of model maker services server-side endpoints.
   * @param   {('error'|'warn'|'info'|'debug')} [args.logLevel=warn]         - Specify logging level
   * @returns {Promise}
   */
  scene.findFirst = function find () {
    console.log('Found nothing')
  }

  return scene

}