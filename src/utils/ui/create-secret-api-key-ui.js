import runtime from '../../core/runtime.js'
import getSession from '../auth/get-session.js'
import getSecretApiKey from '../auth/get-secret-api-key.js'
import regenerateSecretApiKey from '../auth/regenerate-secret-api-key.js'
import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import createSignUpUi from './create-sign-up-ui.js'
import createConfirmUi from './create-confirm-ui.js'
import message from './create-message-ui.js'
import Promise from 'bluebird'

// config

var CSS_WIDTH = 'width:510px;'

// main

export default function createSecretApiKeyUi () {
  runtime.assertBrowser()

  return getSession().then(function (session) {
    if (!session.isAuthenticated) {
      // show sign up screen
      message('Please sign up or log in to<br>access your secret API key.')
      return createSignUpUi().then(function () {
        return createSecretApiKeyUi()
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

      el('<a>', {
        class: 'clickable',
        style: 'display:block;'+CSS_WIDTH,
        html: 'Read documentation about secret API key.',
        href: 'https://3d.io/docs/api/1/authentication.html',
        target: '_blank'
      }).appendTo(overlay.bottomEl)

      // centered

      var centerEl = el('<div>', {style: CSS_WIDTH}).appendTo(overlay.centerEl)

      el('<h1>', {text: 'Secret API Key'}).appendTo(centerEl)

      // main tab

      var mainTabEl = el('<div>').appendTo(centerEl)

      var secretApiKeyElTitle = el('<p>', {
        html: 'Please use this key only in secure environments and expose it only to trusted 3rd parties.'
      }).appendTo(mainTabEl)

      var secretApiKeyContainerEl = el('<p>',{
        style: 'position:relative;'
      }).appendTo(mainTabEl)

      var secretApiKeyEl = el('<input>', {type: 'text'}).appendTo(secretApiKeyContainerEl)
      var revealButtonEl = el('<div>', {
        text: 'reveal',
        class: 'reveal-api-key-button',
        click: function () {
          revealButtonEl.hide()
          getSecretApiKey().then(function (key) {
            secretApiKeyEl.val(key)
          })
        }
      }).appendTo(secretApiKeyContainerEl)
      secretApiKeyEl.addEventListener('click', secretApiKeyEl.select)

      el('<p>', {
        class: 'regegenerate-secret-key-button',
        html: 'Regenerate key',
        click: function () {
          destroy(function () {
            // ask user for allowed domains
            createConfirmUi({
              title: 'Regenrate Key',
              message: 'Are you sure you want to regenrate your secret key ?<br><br>This action can not be undone.'
            }).then(function (isConfirmed) {
              // regenerate key if user has confirmed
              if (isConfirmed) {
                return regenerateSecretApiKey().then(function(key){
                  message.success('Regenerated secret API key')
                })
              }
            }).then(function () {
              // return to secret api key ui
              createSecretApiKeyUi().then(resolve, reject)
            }).catch(function(error){
              message.error('Error regenerating secret API key:<br>'+error)
              // return to secret api key ui
              createSecretApiKeyUi().then(resolve, reject)
            })
          })
        }
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