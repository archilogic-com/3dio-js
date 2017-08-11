import signUp from './auth/sign-up.js'
import activateAccount from './auth/activate-account.js'
import setPassword from './auth/set-password.js'
import requestPasswordReset from './auth/request-password-reset.js'
import resendActivationEmail from './auth/resend-activation-email.js'
import logIn from './auth/log-in.js'
import logOut from './auth/log-out.js'
import getSecretApiKey from './auth/get-secret-api-key.js'
import regenerateSecretApiKey from './auth/regenerate-secret-api-key.js'
import generatePublishableApiKey from './auth/generate-publishable-api-key.js'
import listPublishableApiKeys from './auth/list-publishable-api-keys.js'
import updatePublishableApiKeyDomains from './auth/update-publishable-api-key-domains.js'
import revokePublishableApiKey from './auth/revoke-publishable-api-key.js'
import getSession from './auth/get-session.js'
import session$ from './auth/session-stream.js'

// export

var auth = {
  // user
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
  // secret api key
  getSecretApiKey: getSecretApiKey,
  regenerateSecretApiKey: regenerateSecretApiKey,
  // publishable api keys
  generatePublishableApiKey: generatePublishableApiKey,
  listPublishableApiKeys: listPublishableApiKeys,
  updatePublishableApiKeyDomains: updatePublishableApiKeyDomains,
  revokePublishableApiKey: revokePublishableApiKey
}

export default auth