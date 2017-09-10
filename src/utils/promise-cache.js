import sortBy  from 'lodash/sortBy'

// main

function PromiseCache (args) {

  var args = args || {}

  this.maxResolvedCache = args.maxResolvedCache || 1000

  this._pendingPromises = {}
  this._resolvedPromises = {}

}

PromiseCache.prototype = {

  add: function (key, promise) {

    var self = this

    // check if it already exists
    if (this._pendingPromises[ key ]) {
      return this._pendingPromises[ key ]
    }
    if (this._resolvedPromises[ key ]) {
      return this._resolvedPromises[ key ]
    }

    // create cache object
    var cacheObject = {
      key: key,
      timestamp: Date.now(),
      promise: promise
    }

    // add to store
    this._pendingPromises[ key ] = cacheObject

    // move to resolved store and update state when resolved
    promise.then(function (data) {

      var cacheObject = self._pendingPromises[ key ]
      delete self._pendingPromises[ key ]

      cacheObject.data = data

      self._resolvedPromises[ key ] = cacheObject

    }, function () {

      delete self._pendingPromises[ key ]

    })

    // collect garbage
    this._collectGarbage()

    // return cache object
    return cacheObject

  },

  get: function (key) {

    // check store
    var cacheObject = this._pendingPromises[ key ] || this._resolvedPromises[ key ]
    if (!cacheObject) {
      return false
    }

    // update timestamp
    cacheObject.timestamp = Date.now()

    // return promise
    return cacheObject.promise

  },

  purge: function () {

    for (var key in this._resolvedPromises) {
      delete this._resolvedPromises[ key ]
    }

  },

  _collectGarbage: function () {

    // sort archive by timestamp
    var sortedPromises = sortBy(this._resolvedPromises, function (obj) {
      return obj.timestamp
    })

    // the amount of cache objects that have to be removed
    var removeCount = (sortedPromises.length - this.maxResolvedCache)
    if (removeCount <= 0) {
      return
    }

    for (var i = 0; i < removeCount; i++) {
      delete this._resolvedPromises[ sortedPromises[ i ].key ]
    }

  }

}

export default PromiseCache