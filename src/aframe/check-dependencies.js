import runtime from '../core/runtime.js'

export default function checkDependencies (args, target) {
  if (!runtime.isBrowser){
      return 
  }

  if (args.three && !runtime.browser.has.three) {
    return handleError(args.onError, target, 'Sorry: THREE not available.')
  } else if (args.aframe && !runtime.browser.has.aframe) {
    return handleError(args.onError, target, 'Sorry: AFRAME not available.')
  } else {
    return typeof target === 'function' ? target() : target
  }

}

// helper

function handleError (errorCallback, target, message) {
  // call errorCallback if provided
  if (errorCallback) errorCallback(message)
  // based on target type...
  if (typeof target === 'function') {
    // return a function throwing an error to handle runtime access
    return function onError () {
      throw new Error(message)
    }
  } else {
    return false
  }
}
