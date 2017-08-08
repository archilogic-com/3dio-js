var user = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}
var files = [
  new Blob(['Hello World'], { type: 'text/plain' }),
  new Blob(['Hello World2'], { type: 'text/plain' }),
  new Blob(['Hello World3'], { type: 'text/plain' })
]

io3d.auth.logIn(user).then(function (x) {

  return io3d.storage.put(files)

}).then(function(keys){

  console.log('file keys: ', keys)

})
