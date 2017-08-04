import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createResetPasswordUi from './create-password-reset-request-ui.js'
import message from './create-message-ui.js'
import runtime from '../core/runtime.js'
import getSession from '../auth/get-session.js'
import getPrivateApiKey from '../auth/get-private-api-key.js'
import Promise from 'bluebird'

// main

export default function createDevDashboardUi () {
  runtime.assertBrowser()

  return getSession().then(function (session) {
    if (!session.isAuthenticated) {
      // show login screen
      message('Please sign up or log in to<br>access your dev dashboard.')
      return createSignUpUi().then(function () {
        return createDevDashboardUi()
      })
    }

    // create dashboard promise
    return new Promise(function (resolve, reject) {

      // DOM

      // overlay
      var overlay = createOverlay().show()

      // close button
      el('<div>', {
        text: 'x',
        class: 'button close-button',
        click: function () {
          destroy(function () {
            resolve()
          })
        }
      }).appendTo(overlay.mainEl)

      // stuff at the bottom

      var bottomEl = el('<div>', {
        text: 'Don\'t like your password? Get a new one.',
        style: 'width:450px;',
        class: 'clickable',
        click: function () {
          destroy(function () {
            createResetPasswordUi({email: emailEl.val()}).then(resolve, reject)
          })
        }
      }).appendTo(overlay.bottomEl)

      // centered

      var centerEl = el('<div>', {style: 'width:460px;'}).appendTo(overlay.centerEl)

      el('<h1>', {text: 'Dev Dashboard'}).appendTo(centerEl)

      // main tab

      var mainTabEl = el('<div>').appendTo(centerEl)

      el('<p>', {text: 'Email:', class: 'hint'}).appendTo(mainTabEl)
      var emailEl = el('<input>', {type: 'text'}).appendTo(mainTabEl)
      emailEl.val(session.user.email)

      var privateApiKeyElTitle = el('<p>', {text: 'Private API key:', class: 'hint'}).appendTo(mainTabEl)
      var privateApiKeyEl = el('<input>', {type: 'text'}).appendTo(mainTabEl)
      var revealButtonEl = el('<div>', {
        text: 'reveal',
        class: 'reveal-api-key-button',
        click: function () {
          revealButtonEl.hide()
          getPrivateApiKey().then(function (key) {
            privateApiKeyEl.val(key)
          })
        }
      }).appendTo(privateApiKeyElTitle)

      el('<p>', {
        class: 'hint',
        style: 'margin-top: 1.7em;',
        html: 'Get started with a <a target="_blank" href="https://3dio-aframe.glitch.me/">basic example</a> or dive right into <a target="_blank" href="https://3d.io/docs/api/1/">documentation</a>.'
      }).appendTo(mainTabEl)

      // register ESC key

      function onKeyDown (e) {
        // ESC
        if (e.keyCode === 27) destroy(resolve)
      }
      document.body.addEventListener('keydown', onKeyDown)

      // methods

      function destroy (callback) {
        // unbind events
        document.body.removeEventListener('keydown', onKeyDown)
        // remove DOM elements
        overlay.destroy(callback)
      }

    })
  })
}