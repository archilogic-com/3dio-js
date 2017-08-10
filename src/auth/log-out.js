import callServices from '../utils/services/call.js'
import getSession from './get-session.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Log out currently authenticated user.
 * @function io3d.auth.logOut
 */
export default function logOut () {

  log.debug('Sending API log out request...')
  return callServices('User.logOut').then(function onLogoutSuccess (result) {

    // verify if user has been logged out
    return getSession()

  }).then(function onSessionSuccess (session) {

    if (!session.isAuthenticated) {
      log.debug('API: Log out successful.')
      return session
    } else {
      return Promise.reject('Log out error: Session has not been terminated.')
    }

  }).catch(function onError (error) {

    log.error('Log out error.', error)
    return Promise.reject(error)

  })
}