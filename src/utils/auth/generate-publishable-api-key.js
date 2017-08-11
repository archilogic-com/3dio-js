import callServices from '../services/call.js'
import Promise from 'bluebird'
import log from 'js-logger'

/**
 * Generate publishable API key
 */

export default function generatePublishableApiKey (args) {

  var allowedDomains = args.allowedDomains

  log.debug('Sending API request to generate publishable API key ...')
  return callServices('Organization.generatePublishableApiKey', {
    allowedDomains: allowedDomains
  }).then(function onSuccess(key) {
    log.debug('API: Generating publishable API key successful: ', key)
    return key
  }, function onReject(error) {
    log.error('API: Error generating publishable key.', error)
    return Promise.reject(error)
  })
}