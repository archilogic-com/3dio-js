$(function () {

  // list of example files referenced by title
  var examples = [{
    title: '[autosave]',
    key: '[autosave]'
  }, {
    title: 'Upload single file',
    file: 'upload-single-file.js'
  }, {
    title: 'Upload file with key',
    file: 'upload-file-with-key.js'
  }, {
    title: 'Upload multiple files',
    file: 'upload-multiple-files.js'
  }, {
    title: 'Login on login',
    file: 'login-another-user.js'
  }]

  // example path can be specified in URL
  var examplePathFromUrl = getExamplePathFromUrl()

  // element references
  var $exampleList = $('#example-list')
  var $codeEditor = $('#code-editor')
  var $runButton = $('#run-button')
  var $logOutput = $('#log-output')

  // update layout
  updateLayout()
  window.onresize = updateLayout

  // init editor
  var codeEditor = ace.edit($codeEditor[0])
  codeEditor.$blockScrolling = Infinity
  codeEditor.setOptions({
    mode: "ace/mode/javascript",
    tabSize: 2,
    fontSize: "12px"
  })

  // save to local storage
  var saveToLocalStorage = true
  codeEditor.on('change', function onEditorChange(){
    var key = localStorage['3dio_API_playground_currentKey'] ||'autosave'
    if (saveToLocalStorage) {
      localStorage.setItem('3dio_API_playground_code_'+key, codeEditor.getValue())
    }
  })

  // create example list
  examples.forEach(function (item) {
    $('<div>', {
      text: item.title,
      class: 'example-item',
      click: function () {
        loadExample(item)
      }
    }).appendTo($exampleList)
  })

  // load code
  // 1. from local storage
  // 2. or from URL
  // 3. or first in list
  var initialExample = examplePathFromUrl ? { file: examplePathFromUrl } : examples[0]
  loadExample(initialExample).then(function(code){
    if (code) runExample(code)
  })

    // bind run button
  $runButton.on('click', function () {
    runExample(codeEditor.getValue())
  })

  // bind key events
  $(window).on('keydown', function(event){
    var keyCode = event.keyCode ? event.keyCode : event.which
    if (event.ctrlKey || event.metaKey) {
      // ctrl + enter
      if (keyCode === 13) runExample(codeEditor.getValue())
    }
  })

  // proxy console
  var actualConsole = window.console
  window.console = {
    log: function () { window.proxyConsole('log', arguments); },
    debug: function () { window.proxyConsole('debug', arguments); },
    info: function () { window.proxyConsole('info', arguments); },
    warn: function () { window.proxyConsole('warn', arguments); },
    error: function () { window.proxyConsole('error', arguments); }
  }

  var runExampleTimeStamp
  var previousLogTimeStamp
  window.proxyConsole = function proxyConsole (logLevel, logArgs, lineNumber) {

    // also log to the actual console
    actualConsole[logLevel].apply(actualConsole, logArgs)

    // get line number here
    if (!lineNumber) {
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
    var $logEntry = $('<div>', {class: 'log-entry'}).appendTo($logOutput)
    // info on timings and code line
    $('<div>', {
      class: 'log-entry-details',
      text: timeDeltaToRunExampleStart + timeDeltaToPreviousLog + lineNumber
    }).appendTo($logEntry)
    // one log entry can contain multiple arguments
    var logKeys = Object.keys(logArgs)
    logKeys.forEach(function (key, i) {
      var $logArg = $('<div>', {
        class: 'log-entry-' + logLevel
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

  // other methods

  function getExamplePathFromUrl() {
    var hash = window.location.hash
    return hash && hash !== '' && hash !== '#' ? hash.substring(1) : undefined
  }

  function loadExample (item) {
    // clear log output
    $logOutput.empty()

    return Promise.resolve().then(function(){
      if (item.key) {
        // load from storage
        localStorage.setItem('3dio_API_playground_currentKey', item.key)
        return localStorage['3dio_API_playground_code_'+item.key]
      } else {
        // load from file
        return $.ajax({
          type: 'GET',
          dataType: 'text',
          url: './js/examples/' + item.file+ '?cacheBust=' + Date.now()
        })
      }
    }).then(function (text) {
      // update editor
      saveToLocalStorage = false
      codeEditor.setValue(text || '', 1)
      saveToLocalStorage = true
      // update URL
      window.location.hash = item.file ? encodeURI(item.file) : ''
      // return code text
      return text
    }).catch(function (error) {
      // update editor
      saveToLocalStorage = false
      codeEditor.setValue('', 1)
      saveToLocalStorage = true
      // update URL
      window.location.hash = ''
      console.error('Could not load example ', error)
      // return false
      return false
    })
  }

  function runExample (code) {
    // clear log output
    $logOutput.empty()
    // state run code started
    runExampleTimeStamp = null
    previousLogTimeStamp = null
    window.console.log('Running code ...')
    runCode(code, {
      catchErrors: true,
      encapsulate: true
    })
  }

  function runCode (code, options) {
    // API
    options = options || {}
    var catchErrors = options.catchErrors !== undefined ? options.catchErrors : false
    var encapsulate = options.encapsulate !== undefined ? options.encapsulate : false

    // internals
    var injectLineNumberFunction = 'function getLineNumber (e) { var line;' +
      'if (e) { line=e.stack.split("\\n")[1]; }' +
      'else { line = new Error().stack.split("\\n")[3]; }' +
      'var match = /^.*:(\\d*):(\\d)*\\)?$/.exec(line);' +
      'if (match) { return match[1] + ": "; } else { return ""; }' +
      '};'

    // Encapsulate script. New line after code is important in case last line
    // is a comment.
    if (encapsulate) code = '(function(){' + injectLineNumberFunction + code + '\n})()'

    if (catchErrors) code = 'try {' + code + '\n} catch (e) { ' + injectLineNumberFunction + ' window.proxyConsole("error", [e.toString()], getLineNumber(e)); }'

    // run script

    // check for existing script node and remove it before running
    var existingScriptTag = document.getElementById('sdk-script')
    var script = document.createElement('script')

    if (existingScriptTag) {
      existingScriptTag.parentNode.removeChild(existingScriptTag)
    }

    script.id = 'injected-script'

    try {
      script.appendChild(document.createTextNode(code))
      document.body.appendChild(script)

    } catch (e) {
      script.text = code
      document.body.appendChild(script)
    }

  }

  function updateLayout () {

    var winWidth = $('body').width()

    var exampleListWidth = 200
    var marginBetweenContainers = 20
    var halfRestWidth = (winWidth - exampleListWidth - 4 * marginBetweenContainers) / 2

    var $exampleListContainer = $('#example-list-column')
    $exampleListContainer.css({
      left: marginBetweenContainers,
      width: exampleListWidth
    })

    var $codeEditorContainer = $('#code-editor-column')
    $codeEditorContainer.css({
      left: exampleListWidth + 2 * marginBetweenContainers,
      width: halfRestWidth
    })

    var $logOutputContainer = $('#log-output-column')
    $logOutputContainer.css({
      left: exampleListWidth + halfRestWidth + 3 * marginBetweenContainers,
      width: halfRestWidth
    })

    $('.column ').each(function(i, column){
      if (!$(column).is(':visible')) $(column).show()
    })

  }

})