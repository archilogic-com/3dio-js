import runtime from '../../core/runtime.js'
import requestPasswordReset from '../auth/request-password-reset.js'
import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createLogInUi from './create-log-in-ui.js'
import Promise from 'bluebird'

// config

var CSS_WIDTH = 'width:300px;'

// main

export default function createResetPasswordUi (credentials, options) {
  runtime.assertBrowser()
  return new Promise(function (resolve, reject){

    credentials = credentials || {}
    var email = credentials.email

    // overlay
    var overlay = createOverlay().show()

    // DOM

    el('<div>',{
      text: 'x',
      class: 'button close-button',
      click: function onCancel () {
        destroy(function(){
          reject('User canceled action.')
        })
      }
    }).appendTo(overlay.mainEl)

    // centered content

    var centerEl = el('<div>', { style: CSS_WIDTH }).appendTo(overlay.centerEl)

    // tab with email input

    var emailTabEl = el('<div>').appendTo(centerEl)

    el('<h1>',{ text: 'Reset Password' }).appendTo(emailTabEl)

    el('<p>', { text:'email:', class:'hint' }).appendTo(emailTabEl)
    var emailEl = el('<input>',{ type: 'text' }).appendTo(emailTabEl)
    if (email) emailEl.val(email)
    emailEl.focus()
    function onEmailElKeyDown (e) {
      if (e.which === 13) passwordEl.focus()
    }
    emailEl.addEventListener('keydown', onEmailElKeyDown)
    emailEl.addEventListener('input', updateGoButton)

    var goButtonEl = el('<div>',{
      text: 'go',
      class: 'button',
      click: onConfirm
    }).appendTo(emailTabEl)

    // tab with loading screen

    var loadingTabEl = el('<div>', {
      text: '...'
    }).appendTo(centerEl).hide()

    // tab with action message

    var requestSentTabEl = el('<div>').hide().appendTo(centerEl)

    el('<p>',{
      html: 'Check your email for<br>support@archilogic.com<br>and follow instructions.'
    }).appendTo(requestSentTabEl)

    var goButton2El = el('<div>',{
      text: 'ok',
      class: 'button',
      click: function(){
        destroy(function(){
          resolve()
        })
      }
    }).appendTo(requestSentTabEl)

    // stuff at the bottom

    var bottomEl = el('<div>',{
      text: 'Resend activation email.',
      style: CSS_WIDTH,
      class: 'clickable',
      click: function(){
        destroy(function(){
          createSignUpUi(
            {email: emailEl.val()},
            {resendActivation: true}
          ).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    var bottomEl = el('<div>',{
      text: 'Already have an account? Log in.',
      style: CSS_WIDTH,
      class: 'clickable',
      click: function(){
        destroy(function(){
          createLogInUi({ email: emailEl.val() }).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    // register ESC key

    function onKeyDown(e) {
      // ESC
      if (e.keyCode === 27) {
        destroy(function(){
          reject('User canceled action.')
        })
      }
    }
    document.body.addEventListener('keydown', onKeyDown)

    // methods

    function updateGoButton () {
      // highlight button if email has entry
      emailEl.val() !== ''
        ? goButtonEl.addClass('button-highlighted')
        : goButtonEl.removeClass('button-highlighted')
    }
    updateGoButton()

    function onConfirm () {
      // show loading screen
      emailTabEl.hide()
      loadingTabEl.show()
      requestPasswordReset({ email: emailEl.val() }).then(function(){
        // show tab saying that email has been sent
        loadingTabEl.hide()
        requestSentTabEl.show()
      }).then()
    }

    function destroy (callback) {
      // unbind events
      document.body.removeEventListener('keydown', onKeyDown)
      emailEl.removeEventListener('keydown', onEmailElKeyDown)
      emailEl.removeEventListener('input', updateGoButton)
      // remove DOM elements
      overlay.destroy(callback)
    }

  })
}