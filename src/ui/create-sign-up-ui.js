import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createLogInUi from './create-log-in-ui.js'
import createResetPasswordUi from './create-password-reset-request-ui.js'
import message from './create-message-ui.js'
import logOut from '../auth/log-out.js'
import runtime from '../core/runtime.js'
import signUp from '../auth/sign-up.js'
import resendActivationEmail from '../auth/resend-activation-email.js'
import getSession from '../auth/get-session.js'
import poll from '../utils/poll.js'
import Promise from 'bluebird'

// main

export default function createSignUpUi (credentials, options) {
  runtime.assertBrowser()
  return new Promise(function (resolve, reject){

    credentials = credentials || {}
    options = options || {}
    var email = credentials.email
    var resendActivation = !!options.resendActivation
    var waitForActivation = options.waitForActivation !== undefined ? options.waitForActivation : true

    // DOM

    var overlay = createOverlay().show()

    el.add('div',{
      text: 'x',
      class: 'button close-button',
      click: function onCancel () {
        destroy(function(){
          reject('User canceled action.')
        })
      }
    }).appendTo(overlay.mainEl)

    // stuff at the bottom

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

    var bottomEl = el.add('div',{
      text: 'Lost Password? Get a new one.',
      style: 'width:300px;',
      class: 'clickable',
      click: function(){
        destroy(function(){
          createResetPasswordUi({ email: emailEl.val() }).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    // centered content

    var centerEl = el.add('div', { style: 'width:300px;' }).appendTo(overlay.centerEl)

    // tab with email input

    var emailTabEl = el.add('div').appendTo(centerEl)

    el.add('h1',{
      text: resendActivation ? 'Resend Activation Email' : 'Sign Up'
    }).appendTo(emailTabEl)

    el.add('p', { text:'email:', class:'hint' }).appendTo(emailTabEl)
    var emailEl = el.add('input',{ type: 'text' }).appendTo(emailTabEl)
    if (email) emailEl.val(email)
    emailEl.focus()
    function onEmailElKeyup (e) {
      if (e.which === 13) onConfirm()
    }
    emailEl.addEventListener('keyup', onEmailElKeyup)
    emailEl.addEventListener('input', updateGoButton)

    var goButtonEl = el.add('div',{
      text: 'go',
      class: 'button',
      click: onConfirm
    }).appendTo(emailTabEl)

    // register ESC key

    function onKeyUp (e) {
      if (e.keyCode === 27) {
        destroy(function () {
          reject('User canceled action.')
        })
      }
    }
    document.body.addEventListener('keyup', onKeyUp)

    // tab with loading screen

    var loadingTabEl = el.add('div', { text: '...' }).appendTo(centerEl).hide()

    // tab with activation message

    var activationTabEl = el.add('div').hide().appendTo(centerEl)

    el.add('p',{
      html: 'Check your email for<br>support@archilogic.com<br>and set your password.<br><br>Then simply return here ;)'
    }).appendTo(activationTabEl)

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

      logOut()
        .then(function(){
          if (resendActivation) {
            // resend activation email
            return resendActivationEmail({ email: emailEl.val() })
          } else {
            // sign up
            return signUp({ email: emailEl.val() })
          }
        })
        .then(function(){
          // wait for activation
          if (waitForActivation) return pollForActivation()
          // or show error if signup rejected
        }, function(error){
          // catch specific errors
          if (error.indexOf('User with this email already exists') > -1) {
            // switch to log in tab
            message.error(error)
            destroy(function(){
              createLogInUi({ email: emailEl.val() }).then(resolve, reject)
            })
          } else {
            loadingTabEl.hide()
            emailTabEl.show()
            return Promise.reject(error)
          }
        })
        .then(function(){
          // all done
          destroy(resolve)
        })
    }

    function pollForActivation () {
      emailTabEl.hide()
      loadingTabEl.hide()
      activationTabEl.show()

      return poll(function(resolve, reject, next){
        getSession().then(function(session){
          session.isAuthenticated ? resolve(session) : next()
        })
      })
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