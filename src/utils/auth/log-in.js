import Promise from 'bluebird'
import log from 'js-logger'
import callServices from '../services/call.js'
import uuid from '../uuid.js'
import getSession from './get-session.js'
import runtime from '../../core/runtime.js'
/**
 * Login in user using credentials
 * @function io3d.auth.logIn
 * @param {object} args
 * @param {string} args.username - User username or email
 * @param {string} args.password - User password
 */

export default function logIn(args) {
  var credentials = {
    username: args.username || args.email,
    password: args.password || uuid.generate()
  }

  // log out first
  log.debug(
    'Sending API login request for user "' + credentials.username + '" ...'
  )
  return callServices('User.logOut')
    .then(function onLogoutSuccess() {
      // send log in request
      return callServices('User.logIn', {
        loginData: {
          resourceName: credentials.username,
          password: credentials.password
        }
      })
    })
    .then(function onLoginSuccess() {
      // request session to verify login with a separate request
      return getSession()
    })
    .then(function onSessionSuccess(session) {
      if (session.isAuthenticated) {
        log.debug(
          'API: User "' + session.user.email + '" logged in successfully.'
        )
        return session
      } else {
        if(runtime.isNode) return Promise.reject('io3d.auth.logIn cannot be used in node.js. Please use secret key authentication instead. See https://3d.io/docs/api/1/get-started-node-server.html#using-secret-api-key for further info.')
        else return Promise.reject('Log in error: Session could not been established.')
      }
    })
    .catch(function onError(error) {
      // login failed
      log.debug(
        'API: Could not log in user "' + credentials.email + '".',
        error
      )
      return Promise.reject(error)
    })
}
