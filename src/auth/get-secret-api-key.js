import callServices from '../utils/services/call.js'
import regenerateSecretApiKey from './regenerate-secret-api-key.js'
import log from 'js-logger'

/**
 * Get secret API key
 * @function io3d.auth.getSecretApiKey
 */

export default function getSecretApiKey () {
  log.debug('Sent API request reading secret key ...')
  return callServices('Organization.read').then(function onSuccess (result) {
    if (result.secretApiKey) {
      log.debug('Received secret API key from API')
      return result.secretApiKey
    } else {
      // user has no secret key yet: generate one
      log.debug('User has no secret key. Sent request to generate one.')
      return regenerateSecretApiKey()
    }
  }, function onError (error) {
    log.debug('Error receiving secret API key')
    return Promise.reject(error)
  })
}