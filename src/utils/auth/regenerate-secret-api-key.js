import callServices from '../services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Reenerate secret API key
 */

export default function regenerateSecretApiKey () {
  log.debug('Sending API request to generate secret API key ...')
  return callServices('Organization.generateSecretApiKey').then(function onSuccess(key) {
    log.debug('API: Generating secret API key successful: ', key)
    return key
  }, function onReject(error) {
    log.error('API: Error generating secret key.', error)
    return Promise.reject(error)
  })
}