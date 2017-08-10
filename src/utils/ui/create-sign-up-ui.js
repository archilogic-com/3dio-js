import runtime from '../../core/runtime.js'
import logOut from '../auth/log-out.js'
import signUp from '../auth/sign-up.js'
import resendActivationEmail from '../auth/resend-activation-email.js'
import getSession from '../auth/get-session.js'
import poll from '../poll.js'
import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createLogInUi from './create-log-in-ui.js'
import createResetPasswordUi from './create-password-reset-request-ui.js'
import message from './create-message-ui.js'
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

    el('<div>',{
      text: 'x',
      class: 'button close-button',
      click: function onCancel () {
        destroy(function(){
          reject('User canceled action.')
        })
      }
    }).appendTo(overlay.mainEl)

    // stuff at the bottom

    var bottomEl = el('<div>',{
      text: 'Already have an account? Log in.',
      style: 'width:300px;',
      class: 'clickable',
      click: function(){
        destroy(function(){
          createLogInUi({ email: emailEl.val() }).then(resolve, reject)
        })
      }
    }).appendTo(overlay.bottomEl)

    var bottomEl = el('<div>',{
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

    var centerEl = el('<div>', { style: 'width:300px;' }).appendTo(overlay.centerEl)

    // tab with email input

    var emailTabEl = el('<div>').appendTo(centerEl)

    el('<h1>',{
      text: resendActivation ? 'Resend Activation Email' : 'Sign Up'
    }).appendTo(emailTabEl)

    el('<p>', { text:'email:', class:'hint' }).appendTo(emailTabEl)
    var emailEl = el('<input>',{ type: 'text' }).appendTo(emailTabEl)
    if (email) emailEl.val(email)
    emailEl.focus()
    function onEmailElKeyDown (e) {
      if (e.which === 13) onConfirm()
    }
    emailEl.addEventListener('keydown', onEmailElKeyDown)
    emailEl.addEventListener('input', updateGoButton)

    var goButtonEl = el('<div>',{
      text: 'go',
      class: 'button',
      click: onConfirm
    }).appendTo(emailTabEl)

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

    // tab with loading screen

    var loadingTabEl = el('<div>', { text: '...' }).appendTo(centerEl).hide()

    // tab with activation message

    var activationTabEl = el('<div>').hide().appendTo(centerEl)

    el('<p>',{
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

      if (!validateEmail(emailEl.val())) {
        message.error('Please provide a valid email.')
        return
      }

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
          message.error(error)
          // catch specific errors
          if (error.indexOf('User with this email already exists') > -1) {
            // switch to log in tab
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
      document.body.removeEventListener('keydown', onKeyDown)
      emailEl.removeEventListener('keydown', onEmailElKeyDown)
      emailEl.removeEventListener('input', updateGoButton)
      // remove DOM elements
      overlay.destroy(callback)
    }

  })
}

// helpers

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}