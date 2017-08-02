import Promise from 'bluebird'

export default function poll(callback, options) {

  // API
  options = options || {}
  var timeout = options.timeout || 10 * 60 * 1000
  var minInterval = options.minInterval || 1000
  var maxInterval = options.maxInterval || 5000
  var intervalIncreaseFactor = options.intervalIncreaseFactor || 1.05

  return new Promise(function( fulfill, reject, onCancel ){
    var flags = { isCancelled: false }
    // cancellation is supported in bluebird version > 3.x
    // enable cancellation in Promise.config as it is off by default
    if (onCancel) onCancel(function(){ flags.isCancelled = true; })
    // start recursive poll
    recursivePoll(callback, fulfill, reject, minInterval, maxInterval, intervalIncreaseFactor, 0, timeout, flags)
  })

}

// helper

function recursivePoll(callback, fulfill, reject, interval, maxInterval, intervalIncreaseFactor, timeElapsed, timeout, flags) {

  // return if poll has been cancelled in meanwhile
  if (flags.isCancelled) return reject('Poll request has been cancelled')
  // increase interval
  if (interval < maxInterval) interval *= intervalIncreaseFactor
  // check timeout
  if (timeElapsed > timeout) return reject('Poll request timed out')
  // count time
  timeElapsed += interval
  // call
  callback(fulfill, reject, function next() {
    window.setTimeout(function(){
      recursivePoll(callback, fulfill, reject, interval, maxInterval, intervalIncreaseFactor, timeElapsed, timeout, flags)
    }, interval)
  })

}