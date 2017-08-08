var user = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}
var file = new Blob(['Hello World'], { type: 'text/plain' })
file.name = 'booo.txt'

io3d.auth.logIn(user).then(function (x) {

  return io3d.storage.put(file)

}).then(function(key){

  console.log('file uploaded to:', 'https://storage.3d.io'+key)

})
