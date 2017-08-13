import runtime from '../../core/runtime.js'
import getSession from '../auth/get-session.js'
import listPublishableApiKeys from '../auth/list-publishable-api-keys.js'
import generatePublishableApiKey from '../auth/generate-publishable-api-key.js'
import revokePublishableApiKey from '../auth/revoke-publishable-api-key.js'
import updatePublishableApiKeyDomains from '../auth/update-publishable-api-key-domains.js'
import el from './common/dom-el.js'
import createOverlay from './common/create-overlay.js'
import message from './create-message-ui.js'
import createPromptUi from './create-prompt-ui.js'
import createConfirmUi from './create-confirm-ui.js'

// configs

var CSS_WIDTH = 'width:620px;'

// main

export default function createPublishableApiKeysUi (a, b) {
  runtime.assertBrowser()

  return getSession().then(function (session) {
    if (!session.isAuthenticated) {
      // show sign up screen
      message('Please sign up or log in to<br>access your publishable API keys.')
      return createSignUpUi().then(function () {
        return createPublishableApiKeysUi()
      })
    }

    return new Promise(function (resolve, reject) {

      // overlay
      var overlay = createOverlay().show()

      // close button

      el('<div>', {
        text: 'x',
        class: 'button close-button',
        click: cancel
      }).appendTo(overlay.mainEl)

      // centered

      var centerEl = el('<div>', {
        class: 'publishable-api-keys',
        style:CSS_WIDTH
      }).appendTo(overlay.centerEl)

      el('<h1>', {html: 'Publishable API Keys'}).appendTo(centerEl)

      var listEl = el('<div>', {class: 'list'}).appendTo(centerEl)
      listPublishableApiKeys().then(function onSuccess (list) {
        // create html elements for every key
        list.forEach(function (item) {

          var containerEl = el('<div>', {
            class: 'key-item'
          }).appendTo(listEl)

          var keyEl = el('<input>', {
            class: 'key',
            type: 'text',
            value: item.key
          }).appendTo(containerEl)
          keyEl.addEventListener('click', keyEl.select)

          el('<div>', {
            class: 'hint domains',
            html: 'Domains: ' + item.allowedDomains.join(' ')
          }).appendTo(containerEl)

          el('<div>', {
            class: 'button delete-key-button',
            click: function () {
              destroy(function(){
                createConfirmUi({
                  width: 500,
                  title: 'Delete Publishable API Key ?',
                  message: 'This action can not be undone.<br><br>Key:<br><b>'+item.key+'</b><br><br>Allowed domains:<br><b>'+item.allowedDomains.join(' ')+'</b>'
                }).then(function(isConfirmed){
                  if (isConfirmed) {
                    return revokePublishableApiKey({ key: item.key }).then(function(){
                      message.success('Deleted publishable API key<br>'+item.key)
                    })
                  }
                }).then(function(){
                  // return to publishable api key ui
                  createPublishableApiKeysUi().then(resolve, reject)
                }).catch(function(error){
                  message.error('Error deleting publishable API key<br>'+error)
                  // return to publishable api key ui
                  createPublishableApiKeysUi().then(resolve, reject)
                })
              })
            }
          }).appendTo(containerEl)

          el('<div>', {
            class: 'button edit-domains-button',
            click: function () {
              destroy(function () {
                // ask user for allowed domains
                createPromptUi({
                  title: 'Allowed Domains',
                  message: 'Publishable API key:<br><b>'+item.key+'</b><br><br>Please specify allowed domains separated by empty space.<br>Example: "localhost *.3d.io mypage.com"',
                  bottom: el('<a>', {
                    html: 'Read more about allowed domains',
                    href: 'https://3d.io/docs/api/1/authentication.html',
                    target: '_blank'
                  }),
                  value: item.allowedDomains.join(' ')
                }).then(function (result) {
                  // update key if user has confirmed
                  if (result || result === '') {
                    return updatePublishableApiKeyDomains({
                      key: item.key,
                      allowedDomains: result.split(' ')
                    }).then(function(){
                      message.success('Updated allowed domains to:<br>'+result)
                    })
                  }
                }).then(function () {
                  // return to publishable api key ui
                  createPublishableApiKeysUi().then(resolve, reject)
                }).catch(function(error){
                  message.error('Error updating publishable API key:<br>'+error)
                  // return to publishable api key ui
                  createPublishableApiKeysUi().then(resolve, reject)
                })
              })
            }
          }).appendTo(containerEl)

        })
      })

      el('<div>', {
        class: 'generate-new-key-button',
        html: 'Generate new key',
        click: function () {
          destroy(function () {
            // ask user for allowed domains
            createPromptUi({
              width: 550,
              title: 'Generate Publishable Api Key',
              message: 'Please specify allowed domains separated by empty space.<br>Example: "localhost *.3d.io mypage.com"',
              bottom: el('<a>', {
                html: 'Read more about allowed domains',
                href: 'https://3d.io/docs/api/1/authentication.html',
                target: '_blank'
              })
            }).then(function (result) {
              // generate key if user has confirmed
              if (result || result === '') {
                return generatePublishableApiKey({allowedDomains: result.split(' ')}).then(function(key){
                  message.success('Generated new publishable API key<br>'+key)
                })
              }
            }).then(function () {
              // return to publishable api key ui
              createPublishableApiKeysUi().then(resolve, reject)
            }).catch(function(error){
              message.error('Error generating publishable API key:<br>'+error)
              // return to publishable api key ui
              createPublishableApiKeysUi().then(resolve, reject)
            })
          })
        }
      }).appendTo(centerEl)

      // stuff at the bottom

      el('<a>', {
        class: 'clickable',
        style: 'display:block;'+CSS_WIDTH,
        html: 'Read documentaion about publishable API keys.',
        href: 'https://3d.io/docs/api/1/authentication.html',
        target: '_blank'
      }).appendTo(overlay.bottomEl)

      // methods

      function cancel () {
        destroy(function () {
          resolve(false)
        })
      }

      function destroy (callback) {
        // remove DOM elements
        overlay.destroy(callback)
      }

    })

  })
}