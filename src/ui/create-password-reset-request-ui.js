import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createLogInUi from './create-log-in-ui.js'
import requestPasswordReset from '../auth/request-password-reset.js'
import runtime from '../core/runtime.js'
import Promise from 'bluebird'

// main

export default function createResetPasswordUi (credentials, options) {
  runtime.assertBrowser()
  return new Promise(function (resolve, reject){

    credentials = credentials || {}
    var email = credentials.email

    // overlay
    var overlay = createOverlay().show()

    // DOM

    el.add('div',{
      text: 'x',
      class: 'button close-button',
      click: function onCancel () {
        destroy(function(){
          reject('User canceled action.')
        })
      }
    }).appendTo(overlay.mainEl)

    // centered content

    var centerEl = el.add('div', { style: 'width:300px;' }).appendTo(overlay.centerEl)

    // tab with email input

    var emailTabEl = el.add('div').appendTo(centerEl)

    el.add('h1',{ text: 'Reset Password' }).appendTo(emailTabEl)

    el.add('p', { text:'email:', class:'hint' }).appendTo(emailTabEl)
    var emailEl = el.add('input',{ type: 'text' }).appendTo(emailTabEl)
    if (email) emailEl.val(email)
    emailEl.focus()
    function onEmailElKeyup (e) {
      if (e.which === 13) passwordEl.focus()
    }
    emailEl.addEventListener('keyup', onEmailElKeyup)
    emailEl.addEventListener('input', updateGoButton)

    var goButtonEl = el.add('div',{
      text: 'go',
      class: 'button',
      click: onConfirm
    }).appendTo(emailTabEl)

    // tab with loading screen

    var loadingTabEl = el.add('div', {
      text: '...'
    }).appendTo(centerEl).hide()

    // tab with action message

    var requestSentTabEl = el.add('div').hide().appendTo(centerEl)

    el.add('p',{
      html: 'Check your email for<br>support@archilogic.com<br>and follow instructions.'
    }).appendTo(requestSentTabEl)

    var goButton2El = el.add('div',{
      text: 'ok',
      class: 'button',
      click: function(){
        destroy(function(){
          resolve()
        })
      }
    }).appendTo(requestSentTabEl)

    // stuff at the bottom

    var bottomEl = el.add('div',{
      text: 'Resend activation email.',
      style: 'width:300px;',
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

    var bottomEl = el.add('div',{
      text: 'Already have an account? Log in.',
      style: 'width:300px;',
      class: 'clickable',
      click: function(){
        destroy(function(){
          createLogInUi({ email: emailEl.val() }).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    // register ESC key

    function onKeyUp(e) {
      if (e.keyCode === 27) {
        destroy(function(){
          reject('User canceled action.')
        })
      }
    }
    document.body.addEventListener('keyup', onKeyUp)

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
      document.body.removeEventListener('keyup', onKeyUp)
      emailEl.removeEventListener('keyup', onEmailElKeyup)
      emailEl.removeEventListener('input', updateGoButton)
      // remove DOM elements
      overlay.destroy(callback)
    }

  })
}