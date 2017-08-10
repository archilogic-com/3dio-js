import runtime from '../../core/runtime.js'
import logIn from '../auth/log-in.js'
import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createResetPasswordUi from './create-password-reset-request-ui.js'
import message from './create-message-ui.js'
import Promise from 'bluebird'

// main

export default function createLogInUi (args) {
  runtime.assertBrowser()
  return new Promise(function (resolve, reject) {

    // params

    args = args || {}
    var credentials = {
      email: args.email,
      password: args.password
    }

    // DOM

    var overlay = createOverlay().show()

    // close button
    el('<div>', {
      text: 'x',
      class: 'button close-button',
      click: function cancel () {
        destroy(function () {
          reject('User canceled action.')
        })
      }
    }).appendTo(overlay.mainEl)

    // stuff at the bottom

    el('<div>', {
      text: 'New? Sign up now.',
      style: 'width:300px;',
      class: 'clickable',
      click: function () {
        destroy(function () {
          createSignUpUi({email: emailEl.val()}).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    el('<div>', {
      text: 'Lost Password? Get a new one.',
      style: 'width:300px;',
      class: 'clickable',
      click: function () {
        destroy(function () {
          createResetPasswordUi({email: emailEl.val()}).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    // centered content

    var centerEl = el('<div>', {style: 'width:300px;'}).appendTo(overlay.centerEl)

    el('<h1>', {
      text: 'Log In'
    }).appendTo(centerEl)

    // email field

    el('<p>', {text: 'email:', class: 'hint'}).appendTo(centerEl)
    var emailEl = el('<input>', {type: 'text'}).appendTo(centerEl)
    if (credentials.email) emailEl.val(credentials.email)
    function onEmailElKeyDown (e) {
      if (e.which === 13) passwordEl.focus()
    }
    emailEl.addEventListener('keydown', onEmailElKeyDown)
    emailEl.addEventListener('input', updateGoButton)

    // password field

    el('<p>', {text: 'password:', class: 'hint'}).appendTo(centerEl)
    var passwordEl = el('<input>', {type: 'password'}).appendTo(centerEl)
    if (credentials.password) passwordEl.val(credentials.password)
    function onPasswordElKeyDown (e) {
      if (e.which === 13) confirm()
    }
    passwordEl.addEventListener('keydown', onPasswordElKeyDown)
    passwordEl.addEventListener('input', updateGoButton)

    // focus input field

    if (!credentials.email) {
      emailEl.focus()
    } else if (!credentials.password) {
      passwordEl.focus()
    }

    var goButtonEl = el('<div>', {
      text: 'go',
      class: 'button',
      click: confirm
    }).appendTo(centerEl)

    // register ESC key

    function onKeyDown (e) {
      // ESC
      if (e.keyCode === 27) {
        destroy(function () {
          reject('User canceled action.')
        })
      }
    }
    document.body.addEventListener('keydown', onKeyDown)

    // methods

    function updateGoButton () {
      // highlight button if email and password have entries
      emailEl.val() !== '' && passwordEl.val() !== ''
        ? goButtonEl.addClass('button-highlighted')
        : goButtonEl.removeClass('button-highlighted')
    }

    updateGoButton()

    function confirm () {
      // TODO: show loading or provide other visual feedback
      logIn({
        email: emailEl.val(),
        password: passwordEl.val()
      }).then(function onLogInSuccess () {
        // log in successful
        destroy(resolve)
      }, function onLogInReject (error) {
        // show message
        message.error(error)
        // offer to resend activation email
        if (error.indexOf('check your email and activate your account first') > -1) {
          destroy(function () {
            createSignUpUi(
              {email: emailEl.val()},
              {resendActivation: true}
            ).then(resolve, reject)
          })
        }
      })

    }

    function destroy (callback) {
      // unbind events
      document.body.removeEventListener('keydown', onKeyDown)
      emailEl.removeEventListener('keydown', onEmailElKeyDown)
      emailEl.removeEventListener('input', updateGoButton)
      passwordEl.removeEventListener('keydown', onPasswordElKeyDown)
      passwordEl.removeEventListener('input', updateGoButton)
      // remove DOM elements
      overlay.destroy(callback)
    }

  })
}