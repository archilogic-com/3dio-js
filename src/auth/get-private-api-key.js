import callServices from '../utils/services/call.js'
import regeneratePrivateApiKey from './regenerate-private-api-key.js'
import log from 'js-logger'

/**
 * Get private API key
 * @function IO3D.auth.getPrivateApiKey
 */

export default function getPrivateApiKey () {
  log.debug('Sent API request reading private key ...')
  return callServices('Organization.read').then(function onSuccess (result) {
    if (result.apiKey) {
      log.debug('Received private API key from API')
      return result.apiKey
    } else {
      // user has no private key yet: generate one
      log.debug('User has no private key. Sent request to generate one.')
      return regeneratePrivateApiKey()
    }
  }, function onError (error) {
    log.debug('Error receiving private API key')
    return Promise.reject(error.message)
  })
}