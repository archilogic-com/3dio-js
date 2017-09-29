// (based on underscore)
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

export default function debounce (func, options) {

  // API
  options = options || {}
  var wait = options.wait !== undefined ? options.wait : 500
  var immediate = options.immediate !== undefined ? options.immediate : false
  var context = options.context !== undefined ? options.context : this

  // validate
  if (wait === 0) throw 'param "wait" must be larger than 0'
  if (typeof func !== 'function') throw 'Please provide a function as first argument'

  // internals
  var args, timeout = null

  function runLater () {
    timeout = null
    if (!immediate) func.apply(context, args)
  }

  return function debounced () {
    args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(runLater, wait)
    if (immediate && !timeout) func.apply(context, args)
  }

}