import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createLogInUi from './create-log-in-ui.js'
import requestPasswordReset from '../auth/request-password-reset.js'
import runtime from '../core/runtime.js'
import Promise from 'bluebird'

// main

export default function createAlertUi (a, b) {
  runtime.assertBrowser()
  return new Promise(function (resolve, reject){

    var options
    if (el.isElement(a) || typeof a === 'string') {
      options = b || {}
      options.message = a
    } else if (typeof a === 'object') {
      options = a
    } else {
      throw 'Argument mismatch'
    }

    var title = options.title
    var message = options.message
    var bottom = options.bottom
    var fixWidth = options.width && typeof options.width === 'number' ? options.width+'px' : options.width
    var maxWidth = options.maxWidth && typeof options.maxWidth === 'number' ? options.maxWidth+'px' : options.maxWidth || '450px'
    var hasCloseButton = defaultTo(options.closeButton, true)
    var hasConfirmButton = defaultTo(options.confirmButton, true)
    var hasCancelButton = defaultTo(options.cancelButton, true)

    // internals
    var widthCss = fixWidth ? 'width:'+fixWidth+';max-width:'+maxWidth+';' : 'max-width:'+maxWidth+';'

    // overlay
    var overlay = createOverlay().show()

    // DOM

    if (hasCloseButton) el('<div>',{
      text: 'x',
      class: 'button close-button',
      click: cancel
    }).appendTo(overlay.mainEl)

    // centered content

    var centerEl = el('<div>', { style: widthCss }).appendTo(overlay.centerEl)

    if (title) el('<h1>').append(title).appendTo(centerEl)
    if (message) el('<div>').append(message).appendTo(centerEl)

    if (hasCancelButton) el('<div>', {
      text: 'x',
      class: 'button',
      click: cancel
    }).appendTo(centerEl)

    if (hasConfirmButton) el('<div>', {
      text: 'ok',
      class: 'button',
      click: confirm
    }).appendTo(centerEl)

    // stuff at the bottom

    if (bottom) el('<div>', { style: widthCss }).append(bottom).appendTo(overlay.centerEl)

    // register ESC key

    function onKeyDown(e) {
      if (e.keyCode === 27) cancel() // ESC
    }
    document.body.addEventListener('keydown', onKeyDown)

    // methods

    function confirm () {
      destroy(function(){
        resolve(true)
      })
    }

    function cancel () {
      destroy(function(){
        resolve(false)
      })
    }

    function destroy (callback) {
      // unbind events
      document.body.removeEventListener('keydown', onKeyDown)
      // remove DOM elements
      overlay.destroy(callback)
    }

  })
}

// helper

function defaultTo (x, val) {
  return x !== undefined ? x : val
}