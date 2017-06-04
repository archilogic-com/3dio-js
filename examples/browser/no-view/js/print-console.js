// proxy console
function printConsole (elId, addDetails) {

  var $logOutput = $(elId)

  var actualConsole = window.console
  window.console = {
    log: function () { window.proxyConsole('log', arguments); },
    debug: function () { window.proxyConsole('debug', arguments); },
    info: function () { window.proxyConsole('info', arguments); },
    warn: function () { window.proxyConsole('warn', arguments); },
    error: function () { window.proxyConsole('error', arguments); },
    time: actualConsole.time,
    timeEnd: actualConsole.timeEnd
  }

  var runExampleTimeStamp
  var previousLogTimeStamp
  window.proxyConsole = function proxyConsole (logLevel, logArgs, lineNumber, silent) {

    // also log to the actual console
    if (!silent) actualConsole[logLevel].apply(actualConsole, logArgs)

    // get line number here
    if (addDetails && !lineNumber) {
      var match = /^.*:(\d*):(\d*)$/.exec(new Error().stack.split('\n')[4])
      lineNumber = match ? '&nbsp;&nbsp;line:' + match[1] : ''
    }
    // calculate timings
    var timeDeltaToRunExampleStart
    if (runExampleTimeStamp) {
      timeDeltaToRunExampleStart = (Date.now() - runExampleTimeStamp) + 'ms'
    } else {
      timeDeltaToRunExampleStart = '0ms'
      runExampleTimeStamp = Date.now()
    }
    var timeDeltaToPreviousLog
    if (previousLogTimeStamp) {
      timeDeltaToPreviousLog = '  (+' + (Date.now() - previousLogTimeStamp) + 'ms)'
    } else {
      timeDeltaToPreviousLog = ''
    }
    previousLogTimeStamp = Date.now()

    // create DOM for log entry
    var $logEntry = $('<div>', {class: 'console-entry'}).appendTo($logOutput)
    // info on timings and code line
    if (addDetails) {
      $('<div>', {
        class: 'console-entry-details',
        html: timeDeltaToRunExampleStart + timeDeltaToPreviousLog + lineNumber
      }).appendTo($logEntry)
    }
    // one log entry can contain multiple arguments
    var logKeys = Object.keys(logArgs)
    logKeys.forEach(function (key, i) {
      var $logArg = $('<div>', {
        class: 'console-entry-' + logLevel
      }).appendTo($logEntry)
      var logArg = logArgs[key]
      if (Array.isArray(logArg)) {
        $logArg.text('[' + logArg.join(', ') + ']')
      } else if (typeof logArg === 'object') {
        $logArg.text(JSON.stringify(logArg, null, '  '))
      } else {
        // TODO: differentiate between number and string
        $logArg.text(logArg)
      }
    })
    // convert URLs to anchor tags
    $logEntry.linkify({defaultProtocol: 'https'})

    // scroll to bottom
    $logOutput.scrollTop($logOutput[0].scrollHeight)
  }

  // also print errors to console
  window.onerror = function (message, codePath, lineNumber) {
    window.proxyConsole("error", [message, codePath + ' :' + lineNumber], null, true)
  }

}