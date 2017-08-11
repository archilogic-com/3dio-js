import callServices from '../services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Update publishable API key domains
 */

export default function updatePublishableApiKeyDomains (args) {

  var key = args.key
  var allowedDomains = args.allowedDomains

  log.debug('Sending API request to update publishable API key domains ...')
  return callServices('Organization.updatePublishableApiKeyDomains', {
    key: key,
    allowedDomains: allowedDomains
  }).then(function onSuccess(message) {
    log.debug('API: Updating publishable API key domains successful: ', message)
    return message
  }, function onReject(error) {
    log.error('API: Error updating publishable key domains.', error)
    return Promise.reject(error)
  })
}