var user = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}
var file = new Blob(['Hello World'], { type: 'text/plain' })
file.name = 'booo.txt'

IO3D.auth.logIn(user).then(function (x) {

  return IO3D.storage.put(file)

}).then(function(key){

  console.log('file uploaded to:', 'https://storage.3d.io'+key)

})
