import runtime from '../../core/runtime.js'
import getSession from '../auth/get-session.js'
import getSecretApiKey from '../auth/get-secret-api-key.js'
import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createResetPasswordUi from './create-password-reset-request-ui.js'
import createPublishableApiKeysUi from './create-publishable-api-keys-ui.js'
import createSecretApiKeyUi from './create-secret-api-key-ui.js'
import message from './create-message-ui.js'
import Promise from 'bluebird'

// config

var CSS_WIDTH = 'width:440px;'

// main

export default function createDevDashboardUi () {
  runtime.assertBrowser()

  return getSession().then(function (session) {
    if (!session.isAuthenticated) {
      // show sign up screen
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
        style: 'white-space: nowrap;',
      }).appendTo(overlay.bottomEl)

      el('<a>', {
        text: 'Get started using 3d.io',
        style: 'display: inline-block;', //+CSS_WIDTH,
        class: 'clickable',
        href: 'https://3d.io/docs/api/1/get-started.html',
        target: '_blank'
      }).appendTo(bottomEl)

      el('<span>', {html: ' | '}).appendTo(bottomEl)

      el('<a>', {
        text: 'Read more about keys',
        style: 'display: inline-block;', //+CSS_WIDTH,
        class: 'clickable',
        href: 'https://3d.io/docs/api/1/authentication.html',
        target: '_blank'
      }).appendTo(bottomEl)

      el('<span>', {html: ' | '}).appendTo(bottomEl)

      el('<div>', {
        text: 'Change password',
        style: 'display: inline-block;', //+CSS_WIDTH,
        class: 'clickable',
        click: function () {
          destroy(function () {
            createResetPasswordUi({email: emailEl.val()}).then(function(){
              // return dev dashboard
              return createDevDashboardUi()
            }, function(){
              // return dev dashboard
              return createDevDashboardUi()
            }).then(resolve, reject)
        })
        }
      }).appendTo(bottomEl)

      // centered

      var centerEl = el('<div>', {
        style: CSS_WIDTH,
        class: 'dev-dashobard'
      }).appendTo(overlay.centerEl)

      el('<h1>', {text: 'Dev Dashboard'}).appendTo(centerEl)

      // main tab

      var mainTabEl = el('<div>').appendTo(centerEl)

      el('<p>', {text: 'Email:', class: 'hint'}).appendTo(mainTabEl)
      var emailEl = el('<input>', {type: 'text'}).appendTo(mainTabEl)
      emailEl.val(session.user.email)

      var keyMenuEl = el('<div>', {
        class:'key-menu'
      }).appendTo(mainTabEl)

      el('<div>', {
        class:'key-image'
      }).appendTo(keyMenuEl)

      el('<div>', {
        class:'key-button go-to-publishable-api-key-ui',
        html: 'Get Publishable API Keys',
        click: function(){
          destroy(function(){
            createPublishableApiKeysUi().then(function(){
              // return dev dashboard
              return createDevDashboardUi()
            }).then(resolve, reject)
          })
        }
      }).appendTo(keyMenuEl)

      el('<div>', {
        class:'key-button go-to-secret-api-key-ui',
        html: 'Get Secret API Key',
        click: function(){
          destroy(function(){
            createSecretApiKeyUi().then(function(){
              // return dev dashboard
              return createDevDashboardUi()
            }).then(resolve, reject)
          })
        }
      }).appendTo(keyMenuEl)

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