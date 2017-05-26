function runCode (str, options) {
  // API
  options = options || {}
  var catchErrors = options.catchErrors !== undefined ? options.catchErrors : false
  var encapsulate = options.encapsulate !== undefined ? options.encapsulate : false
  var isUrl = options.isUrl !== undefined ? options.isUrl : (str.substr(0,4) === 'http' || str[0] === '.')

  return Promise.resolve().then(function () {

    return isUrl ? $.ajax({type: 'GET', dataType: 'text', url: str}) : str

  }).then(function (code) {

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

    if (existingScriptTag) existingScriptTag.parentNode.removeChild(existingScriptTag)

    script.id = 'injected-script'

    try {
      script.appendChild(document.createTextNode(code))
      document.body.appendChild(script)
    } catch (e) {
      script.text = code
      document.body.appendChild(script)
    }

  })
}