import callServices from '../utils/services/call.js'
import getSession from './get-session.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Set password for a specific user
 * @function io3d.auth.setPassword
 * @param {object} args
 * @param {string} args.token
 * @param {string} args.password
 */
export default function setPassword (args) {

  var credentials = {
    token: args.token,
    password: args.password
  }

  // log out first
  return callServices('User.logOut').then(function(){

    // send sign up request
    log.debug('Setting new password ...')
    return callServices('User.changePassword', {
      token: credentials.token,
      oldPassword: null,
      newPassword: password
    })

  }).then(function onSuccess(result) {

    // success
    log.debug('API: setting password successful.')
    return getSession()

  }, function onError(error){

    // denied
    log.debug('API: setting password failed.', error)
    return Promise.reject(error.message)

  })

}