import log from 'js-logger'
import runtime from './runtime.js'

// default configs values

var defaults = Object.freeze({
  logLevel:      'warn',
  publishableApiKey: getPublishableApiKeyFromUrl(),
  secretApiKey: null,
  servicesUrl:   'https://spaces.archilogic.com/api/v2',
  storageDomain: 'storage.3d.io',
  storageDomainNoCdn: 'storage-nocdn.3d.io'
})

// constants

var LOG_STRING_TO_ENUM = {
  error: log.ERROR,
  warn:  log.WARN,
  info:  log.INFO,
  debug: log.DEBUG
}

// main

var configs = function configs (args) {

  if (!args) {
    // no arguments: return copy of configs object
    return JSON.parse(JSON.stringify(this))
  }

  // apply log level if among arguments
  if (args.logLevel) {
    setLogLevel(args.logLevel)
    delete args.logLevel
  }

  // simply copy over the other configs
  var key, keys = Object.keys(args)
  for (var i = 0, l = keys.length; i < l; i++) {
    key = keys[i]
    if (defaults[key] !== undefined) {
      configs[key] = args[key]
    } else {
      log.warn('Unknown config param "' + key + '". Available params are: ' + Object.keys(defaults).join(', '))
    }
  }

  return this
}

// private methods

function setLogLevel (val) {
  // update logger
  var logLevelEnum = LOG_STRING_TO_ENUM[val]
  if (logLevelEnum) {
    // set log level
    log.setLevel(logLevelEnum)
    configs.logLevel = val
  } else {
    // handle error
    var errorMessage = 'Unknown log level "' + val + '". Possible are: "' + Object.keys(LOG_STRING_TO_ENUM).join('", "') + '". '
    if (configs.logLevel) {
      // do not change current log level
      errorMessage += 'Log level remains "' + configs.logLevel
    } else {
      // set default log level
      var defaultVal = defaults.logLevel
      errorMessage += 'Fallback to default "' + defaultVal + '".'
      log.setLevel(LOG_STRING_TO_ENUM[defaultVal])
      configs.logLevel = defaultVal
    }
    console.error(errorMessage)
  }
}

function getPublishableApiKeyFromUrl () {
  if (!runtime.isBrowser) return null
  var libUrl
  if (document.currentScript) {
    libUrl = document.currentScript.getAttribute('src')
  } else {
    // browsers not supporting currentScript
    var src, libSearch
    var scripts = document.getElementsByTagName('script')
    var libNameRegex = new RegExp('(\/3dio\.js|\/3dio\.min\.js)')
    // iterating backwarts as the last script is most likely the current one
    for (var i=scripts.length-1; i>-1; i--) {
      src = scripts[i].getAttribute('src')
      if (libNameRegex.exec(src)) {
        libUrl = src
        break
      }
    }
  }
  var keySearch = /pk=([^&]+)/i.exec(libUrl)
  return keySearch ? keySearch[1] : null
}

// init

configs(JSON.parse(JSON.stringify(defaults)))

// api

export default configs
