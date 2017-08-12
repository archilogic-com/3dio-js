import runtime from '../../core/runtime.js'
import el from './common/dom-el.js'
import createConfirmUi from './create-confirm-ui.js'

// main

export default function createPromptUi (a, b) {
  runtime.assertBrowser()

  var options
  if (el.isElement(a) || typeof a === 'string') {
    options = b || {}
    options.message = a
  } else if (typeof a === 'object') {
    options = a
  } else {
    throw 'Argument mismatch https://3d.io/docs/api/1/ui.html'
  }

  var value = options.value || ''
  var inputMessage = options.message
  var multiLine = options.multiLine
  var multiLineHeight = options.multiLineHeight && typeof options.multiLineHeight === 'number' ? options.multiLineHeight+'px' : options.multiLineHeight
  options.width = options.width ? options.width : '500px'

  // override message with new one
  options.message = el('<div>')
  // append input message
  if (inputMessage) options.message.append(inputMessage)
  // create input box for prompt
  if (multiLine) {
    var style = inputMessage && !el.isElement(inputMessage) ? 'margin: 1em 0 0 0;' : 'margin: 0 0 0 0;'
    style += 'min-height: '+(multiLineHeight ? multiLineHeight : '150px')+';'
    var inputEl = el('<textarea>', { style: style }).appendTo(options.message)
    inputEl.innerHTML = value
  } else {
    var style = inputMessage && !el.isElement(inputMessage) ? 'margin: 1em 0 0.5em 0;' : 'margin: 0 0 0.5em 0;'
    var inputEl = el('<input>', { value: value, style: style }).appendTo(options.message)
  }
  // focus input element
  setTimeout(function () {
    inputEl.focus()
  }, 100)

  return createConfirmUi(options).then(function onConfirm (isConfirmed) {
    // behaves like window.confirm() => return value on confirm or null on cancel
    return isConfirmed ? inputEl.val() : null
  })

}