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

  }).then(function onSuccess(session) {
    log.debug('API: User "' + session.user.displayName + '" logged in successfully.')
    return normalizeSession(session)
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
  return callServices('User.getSession').then(function (session) {
    log.debug('API: session data:\n', session)
    return normalizeSession(session)
  })
}

// helpers

function normalizeSession(session) {
  if (session.isAuthenticated) {
    var user = session.user
    // use 'id' instead of 'resourceId'
    user.id = user.resourceId
    delete user.resourceId
    // make sure every user has a role array
    if (!user.roles) user.roles = []
  }
  return session
}


// export

export default {
  logIn:      logIn,
  logOut:     logOut,
  getSession: getSession
}