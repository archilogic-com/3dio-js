// Login another user

var user1 = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}
var user2 = {name: 'bernhard', password: '6FYUGiF4ZMwt7fEoqLid'}

IO3D.configs({
  logLevel: 'debug'
})

IO3D.user.logIn(user1).then(function () {

  return IO3D.user.logIn(user2)

}).then(function () {

  return IO3D.user.getSession()

})