import callServices from '../utils/services/call.js'
import getSession from './get-session.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Log out currently authenticated user.
 * @function IO3D.auth.logOut
 */
export default function logOut () {
  log.debug('Sending API log out request...')
  return callServices('User.logOut').then(function onSuccess (result) {
    log.debug('API: Log out successful.')
    return getSession()
  }, function onError (error) {
    log.debug('Log out error.', error)
    return Promise.reject(error.message)
  })
}