import normalizeSession from './common/normalize-session.js'
import runtime from '../core/runtime.js'
import callServices from '../utils/services/call.js'
import sessionStream from './session-stream.js'
import Promise from 'bluebird'
import log from 'js-logger'

// init
getSession()

// update session state every time when tab becomes visible
if (runtime.isBrowser) {
  runtime.isFocused$.subscribe(function(isFocused){
    if (isFocused) getSession()
  })
}

// export

/**
 * Get information about the current session.
 * @function io3d.auth.getSession
 */
export default function getSession () {
  log.debug('Sending API session request...')
  return callServices('User.getSession')
    .then(normalizeSession)
    .then(function onSuccess (session) {
      log.debug('API: session data:\n', session)
      // stream session object
      sessionStream.next(session)
      // return result
      return session
    }, function onError (error) {
      log.debug('API: error receiving session data.', error)
      return Promise.reject(error.message)
    })
}