import runtime from '../runtime.js'

export default (function(){

  if (runtime.isNode) {
    return require('node-fetch')
  } else if (typeof fetch !== 'undefined') {
    return fetch
  } else {
    console.warn('Missing global fetch API.')
    return function() {
      throw new Error('Missing global fetch API.')
    }
  }

})()