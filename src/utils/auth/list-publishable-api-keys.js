import callServices from '../services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * List publishable API keys
 */

export default function listPublishableApiKeys () {
  log.debug('Sending API request to list publishable API keys ...')
  return callServices('Organization.listPublishableApiKeys').then(function onSuccess(keys) {
    log.debug('API: Listing publishable API keys successful: ', keys)
    return keys
  }, function onReject(error) {
    log.error('API: Error listing publishable keys.', error)
    return Promise.reject(error)
  })
}