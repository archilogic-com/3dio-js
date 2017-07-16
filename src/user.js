import callServices from './utils/services/call.js'
import log from 'js-logger'

/**
 * Login in user using credentials
 * @function IO3D.user.logIn
 * @param {object} args
 * @param {string} args.name     - User email or username
 * @param {string} args.password - User password
 */
function logIn (args) {
  var name = args.name || args.email // can be email or username (officially: username = userResourceName)
  var password = args.password

  log.debug('Sending API login request for user "' + name + '" ...')
  // always log out first
  return callServices('User.logOut').then(function () {
    // then send the actual log in request
    return callServices('User.logIn', {
      resourceName: name,
      password:     password
    })

  }).then(function (result) {
    log.debug('API: User "' + result.user.displayName + '" logged in successfully.')
    return result.user
  })
}

/**
 * Log out currently authenticated user.
 * @function IO3D.user.logOut
 */
function logOut () {
  log.debug('Sending API log out request...')
  return callServices('User.logOut').then(function (result) {
    log.debug('API: Log out successful.')
    return true
  })
}

/**
 * Get information about the current session.
 * @function IO3D.user.getSession
 */
function getSession () {
  log.debug('Sending API session request...')
  return callServices('User.getSession').then(function (result) {
    log.debug('API: session data:\n', result)
    return result
  })
}

export default {
  logIn:      logIn,
  logOut:     logOut,
  getSession: getSession
}