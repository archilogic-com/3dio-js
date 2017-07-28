import callServices from './utils/services/call.js'
import log from 'js-logger'

/**
 * Login in user using credentials
 * @function IO3D.auth.logIn
 * @param {object} args
 * @param {string} args.name     - User email or username
 * @param {string} args.password - User password
 */
function logIn (args) {
  var name = args.username || args.name || args.email // can be email or username (officially: username = userResourceName)
  var password = args.password

  log.debug('Sending API login request for user "' + name + '" ...')
  // always log out first
  return callServices('User.logOut').then(function () {
    // then send the actual log in request
    return callServices('User.logIn', {
      resourceName: name,
      password:     password
    })

  }).then(normalizeSession).then(function onSuccess(session) {
    log.debug('API: User "' + session.user.username + '" logged in successfully.')
    return session
  }, function onError(error){
    log.debug('API: Could not log in user "' + args.name + '".', error)
    return Promise.reject(error)
  })
}

/**
 * Log out currently authenticated user.
 * @function IO3D.auth.logOut
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
 * @function IO3D.auth.getSession
 */
function getSession () {
  log.debug('Sending API session request...')
  return callServices('User.getSession').then(normalizeSession).then(function (session) {
    log.debug('API: session data:\n', session)
    return session
  })
}

// helpers

function normalizeSession(session_) {

  var isAuthenticated = !!session_.isAuthenticated
  var user = {}

  // populate user object if authenticated
  if (session_.isAuthenticated) {
    user.id = session_.user.resourceId
    user.username = session_.user.resourceName
    user.email = session_.user.email
    user.roles = session_.user.roles || []
  }

  return {
    isAuthenticated: isAuthenticated,
    user: user
  }

}


// export

export default {
  logIn:      logIn,
  logOut:     logOut,
  getSession: getSession
}