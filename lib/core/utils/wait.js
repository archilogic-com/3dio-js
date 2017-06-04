import Promise from 'bluebird'

// function

export default function wait(duration, passThroughValue) {
  return new Promise(function (resolve, reject) {
    setTimeout(function(){
      resolve(passThroughValue)
    }, duration)
  })
}