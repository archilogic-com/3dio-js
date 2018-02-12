import runtime from '../../core/runtime.js'

export default (function() {
  if (typeof fetch !== 'undefined') {
    return fetch
  } else if (runtime.isNode) {
    return runtime.require('node-fetch')
  } else {
    console.warn('Missing global fetch API.')
    return function() {
      throw new Error('Missing global fetch API.')
    }
  }
})()
