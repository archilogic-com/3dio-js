import Promise from 'bluebird'
import callServices from '../utils/services/call.js'
import log from 'js-logger'

/**
 * Reenerate private API key
 */

export default function regeneratePublicKey () {
  log.debug('Sending API request to generate private API key ...')
  return callServices('Organization.generateApiKey').then(function onSuccess(key) {
    log.debug('API: Generating private API key successful: ', key)
    return key
  }, function onReject(error) {
    log.error('API: Error Generating public key.', error)
    return Promise.reject(error.message)
  })
}