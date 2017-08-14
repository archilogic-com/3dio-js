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
        class:'key-image',
        html:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 127"><defs><style>.a{opacity:0.7;stroke-dasharray: 1, 4;}.b{fill:#fff;}.c{fill:none;stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:1px;}.d{opacity:1;}</style></defs><g class="a"><circle class="c" cx="64" cy="64" r="62"/><line class="c" x1="150" y1="30" x2="130" y2="30"/><line class="c" x1="119" y1="36" x2="130" y2="30"/></g><g class="d"><circle class="c" cx="64" cy="64" r="36"/><line class="c" x1="150" y1="98" x2="130" y2="98"/><line class="c" x1="130" y1="98" x2="96.192" y2="82.337"/></g><polygon class="b" points="69.375 60.227 59.813 60.227 59.813 83.867 64.594 86.523 69.375 83.867 67.478 81.581 69.375 79.684 67.478 77.319 69.375 75.422 67.478 73.057 69.375 71.159 67.478 68.794 69.375 66.897 67.478 64.532 69.375 62.635 69.375 60.227"/><path class="b" d="M64.7,39.361A10.894,10.894,0,1,0,75.589,50.255,10.894,10.894,0,0,0,64.7,39.361Zm0,9.056a2.812,2.812,0,1,1,2.812-2.812A2.812,2.812,0,0,1,64.7,48.417Z"/></svg>'
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