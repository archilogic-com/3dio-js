import callServices from '../utils/services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Resend activation email
 * @function io3d.auth.resendActivationEmail
 * @param {object} args
 * @param {string} args.email
 */
export default function resendActivationEmail (args) {

  var credentials = {
    email: args.email
  }

  //
  log.debug('Sending account activation request to API ...')
  return callServices('User.requestAccountActivation', credentials)
    .then(function onSuccess(result) {

      // success
      log.debug('API: requesting account activation successful.')
      return Promise.resolve()

    }, function onError(error){

      // denied
      log.debug('API: requesting account activation failed.', error)
      return Promise.reject(error)

    })


}