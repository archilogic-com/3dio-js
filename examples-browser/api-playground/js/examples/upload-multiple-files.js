var user = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}
var files = [
  new Blob(['Hello World'], { type: 'text/plain' }),
  new Blob(['Hello World2'], { type: 'text/plain' }),
  new Blob(['Hello World3'], { type: 'text/plain' })
]

IO3D.auth.logIn(user).then(function (x) {

  return IO3D.storage.put(files)

}).then(function(keys){

  console.log('file keys: ', keys)

})
