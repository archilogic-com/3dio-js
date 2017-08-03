import signUp from './auth/sign-up.js'
import activateAccount from './auth/activate-account.js'
import setPassword from './auth/set-password.js'
import requestPasswordReset from './auth/request-password-reset.js'
import resendActivationEmail from './auth/resend-activation-email.js'
import logIn from './auth/log-in.js'
import logOut from './auth/log-out.js'
import getPrivateApiKey from './auth/get-private-api-key.js'
import regeneratePrivateApiKey from './auth/regenerate-private-api-key.js'
import getSession from './auth/get-session.js'
import session$ from './auth/session-stream.js'

// export

var auth = {
  getSession: getSession,
  session$: session$,
  signUp: signUp,
  signup: signUp, // alias
  logIn: logIn,
  login: logIn, // alias
  logOut: logOut,
  logout: logOut, // alias
  setPassword: setPassword,
  requestPasswordReset: requestPasswordReset,
  resendActivationEmail: resendActivationEmail,
  getPrivateApiKey: getPrivateApiKey,
  regeneratePrivateApiKey: regeneratePrivateApiKey
}

export default auth