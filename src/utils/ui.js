import runtime from '../core/runtime.js'
import css from './ui/less/style.less'
import createMessageUi from './ui/create-message-ui.js'
import createFileDropUi from './ui/create-file-drop-ui.js'
import createSignUpUi from './ui/create-sign-up-ui.js'
import createLogInUi from './ui/create-log-in-ui.js'
import createLogOutUi from './ui/create-log-out-ui.js'
import requestPasswordResetUi from './ui/create-password-reset-request-ui.js'
import createDevDashboardUi from './ui/create-dev-dashboard-ui.js'
import createPublishableApiKeysUi from './ui/create-publishable-api-keys-ui.js'
import createSecretApiKeyUi from './ui/create-secret-api-key-ui.js'
import createConfirmUi from './ui/create-confirm-ui.js'
import createAlertUi from './ui/create-alert-ui.js'
import createPromptUi from './ui/create-prompt-ui.js'

// add css to page
if (runtime.isBrowser) {
  var style = document.createElement('style')
  style.setAttribute('media', 'screen')
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

// export

var ui = {
  fileDrop: createFileDropUi,
  // authentication
  signUp: createSignUpUi,
  signup: createSignUpUi, // alias
  logIn: createLogInUi,
  login: createLogInUi, // alias
  logOut: createLogOutUi,
  logout: createLogOutUi, // alias
  requestPasswordReset: requestPasswordResetUi,
  devDashboard: createDevDashboardUi,
  publishableApiKeys: createPublishableApiKeysUi,
  secretApiKey: createSecretApiKeyUi,
  // messages
  message: createMessageUi,
  alert: createAlertUi,
  confirm: createConfirmUi,
  prompt: createPromptUi
}

export default ui