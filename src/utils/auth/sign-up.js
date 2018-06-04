import callServices from '../services/call.js'
import uuid from '../uuid.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Sign up: Create a new user
 * @function io3d.auth.signUp
 * @param {object} args
 * @param {string} args.email
 * @param {string} args.password (optional)
 * @param {string} args.emailOptIn (optional)
 */
export default function signUp (args) {

  var credentials = {
    email: args.email,
    password: args.password || uuid.generate(),
    accountSetup: '3dio',
    emailOptIn: args.emailOptIn || false
  }

  // log out first
  return callServices('User.logOut').then(function(){

    // send sign up request
    log.debug('Sending API sign up request for email "' + credentials.email + '" ...')
    return callServices('User.create', credentials)

  }).then(function onSignUpSuccess(result) {

    // success
    log.debug('API: User sign up with email "' + credentials.email + '" was successful.')
    return Promise.resolve()

  }, function onSignUpError(error){

    // denied
    log.debug('API: Could not sign up using email "' + credentials.email + '".', error)
    return Promise.reject(error)

  })

}
