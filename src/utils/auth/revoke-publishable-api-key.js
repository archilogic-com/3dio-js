import callServices from '../services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Revoke publishable API key
 */

export default function revokePublishableApiKey (args) {

  var key = args.key

  log.debug('Sending API request to generate publishable API key ...')
  return callServices('Organization.revokePublishableApiKey', {
    key: key
  }).then(function onSuccess(message) {
    log.debug('API: Revoking publishable API key successful: ', message)
    return message
  }, function onReject(error) {
    log.error('API: Error revoking publishable key.', error)
    return Promise.reject(error)
  })
}