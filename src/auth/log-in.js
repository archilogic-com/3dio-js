import normalizeSession from './common/normalize-session.js'
import callServices from '../utils/services/call.js'
import uuid from '../utils/uuid.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Login in user using credentials
 * @function IO3D.auth.logIn
 * @param {object} args
 * @param {string} args.email - User email or username
 * @param {string} args.password - User password
 */

export default function logIn (args) {

  var credentials = {
    email: args.email,
    password: args.password || uuid.generate()
  }

  // log out first
  log.debug('Sending API login request for user "' + credentials.email + '" ...')
  return callServices('User.logOut').then(function(){

    // send log in request
    return callServices('User.logIn', {
      resourceName: credentials.email,
      password: credentials.password
    })

  }).then(normalizeSession).then(function onSuccess(session) {

    // success
    log.debug('API: User "' + session.user.email + '" logged in successfully.')
    return session

  }, function onError(error){

    // denied
    log.debug('API: Could not log in user "' + credentials.email + '".', error)
    return Promise.reject(error.message)

  })

}