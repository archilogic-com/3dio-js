import runtime from '../../core/runtime.js'

export default (function(){

  if (runtime.isNode) {
    // overwrite whatwg-fetch polyfill
    // FIXME: use require alias after #126 is resolved
    //global.fetch = runtime.require('node-fetch')
    global.fetch = require('node-fetch')
    return global.fetch
  } else if (typeof fetch !== 'undefined') {
    return fetch
  } else {
    console.warn('Missing global fetch API.')
    return function() {
      throw new Error('Missing global fetch API.')
    }
  }

})()