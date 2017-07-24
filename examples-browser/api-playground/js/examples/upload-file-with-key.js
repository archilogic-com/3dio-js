var user = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}
var file = new Blob(['Hello World'], { type: 'text/plain' })

IO3D.auth.logIn(user).then(function (x) {

  return IO3D.storage.put(file, {
    key: '/{{userId}}/test/text.txt'
  })

}).then(function(key){

  console.log('file uploaded to:', 'https://storage.3d.io'+key)

})
