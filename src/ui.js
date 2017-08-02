import runtime from './core/runtime.js'
import css from './ui/less/style.less'
import createMessageUi from './ui/create-message-ui.js'
import createFileDropUi from './ui/create-file-drop-ui.js'
import createSignUpUi from './ui/create-sign-up-ui.js'
import createLogInUi from './ui/create-log-in-ui.js'
import requestPasswordResetUi from './ui/create-password-reset-request-ui.js'
import createDevDashboardUi from './ui/create-dev-dashboard-ui.js'

// add css to page
if (runtime.isBrowser) {
  var style = document.createElement('style')
  style.setAttribute('media', 'screen')
  //style.innerHTML = css
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

// export

var ui = {
  fileDrop: createFileDropUi,
  // authentication
  signUp: createSignUpUi,
  logIn: createLogInUi,
  requestPasswordReset: requestPasswordResetUi,
  devDashboard: createDevDashboardUi,
  // messages
  message: createMessageUi
}

export default ui