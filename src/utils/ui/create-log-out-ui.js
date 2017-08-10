import logOut from '../auth/log-out.js'
import createAlertUi from './create-alert-ui.js'

export default function createLogOutUi () {
  return logOut().then(function onSuccess(){
    return createAlertUi('Log out successful')
  }, function onReject(e) {
    return createAlertUi('Log out error:<br><br>'+e)
  })
}