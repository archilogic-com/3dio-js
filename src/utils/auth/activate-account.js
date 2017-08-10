import callServices from '../services/call.js'
import getSession from './get-session.js'
import log from 'js-logger'
import Promise from 'bluebird'

/**
 * Activate account by providing token and password
 * @function io3d.auth.activateAccount
 * @param {object} args
 * @param {string} args.token - Token string provided by server
 * @param {string} args.password - New password
 */
export default function activateAccount (args) {

  var credentials = {
    token: args.token,
    password: args.password
  }

  log.debug('Sending account activation request...')
  return callServices('User.activateAccount', { arguments: credentials })
    .then(function onSuccess (result) {
      log.debug('Account activation request successful.')
      // update session
      return getSession().then(function(session){
        if (session.isAuthenticated) log.debug('Activated user is logged in.')
        return session
      })
    }, function onError (error) {
      log.debug('Account activation failed.', error)
      return Promise.reject(error)
    })
}