import runtime from '../../core/runtime.js'

// fixme: metro bundler workaround for react-native
const requireAlias = require

export default (function() {
  if (typeof fetch !== 'undefined') {
    return fetch
  } else if (runtime.isNode) {
    return requireAlias('node-fetch')
  } else {
    console.warn('Missing global fetch API.')
    return function() {
      throw new Error('Missing global fetch API.')
    }
  }
})()
