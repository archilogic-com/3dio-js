import callServices from '../services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Request password reset for a specific user
 * @function io3d.auth.requestPasswordReset
 * @param {object} args
 * @param {string} args.email
 */
export default function requestPasswordReset (args) {

  var credentials = {
    email: args.email
  }

  log.debug('Sending password reset request to API ...')
  return callServices('User.requestPasswordReset', credentials)
    .then(function onSuccess(result) {

      // success
      log.debug('API: requesting password reset successful.')
      return Promise.resolve()

    }, function onError(error){

      // denied
      log.debug('API: requesting password reset failed.', error)
      return Promise.reject(error)

    })

}