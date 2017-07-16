// Upload a floor plan image and create a new model

var configs = {logLevel: 'debug'}
var user = {name: 'gertrud', password: 'afgshgrtecsru6ez5dt'}

archilogic.initServices(configs).then(function (services) {

  services.user.logIn(user).then(function (user) {

    return services.file.upload({
      filename: 'upload-tests/image4.jpg',
      file: getBlobFromCanvas(createSomeCanvas())
    })

  }).then(function (result) {

    var newModelStructure = {
      modelDisplayName: 'My Model',
      v: 1,
      type: 'plan',
      x: 2,
      y: 4,
      children: [{
        type: 'level',
        children: [{
          type: 'floorplan',
          file: '/' + result.key,
          l: 6,
          w: 3
        }]
      }]
    }
    return services.model.putStructure({modelStructure: newModelStructure})

  })

})

// helpers

function createSomeCanvas () {
  var c = document.createElement('canvas')
  c.width = 600
  c.height = 300
  var ctx = c.getContext("2d")
  ctx.fillStyle = '#055005'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = '#F88F88'
  ctx.fillRect(20, 20, c.width / 2, c.height / 2)
  return c
}

function getBlobFromCanvas (canvas, imageFormat, imageQuality) {
  imageFormat = imageFormat || 'jpeg'
  imageQuality = imageQuality || 0.99
  // download
  var dataURI = canvas.toDataURL('image/' + imageFormat, imageQuality)
  // decode dataURL
  var binary = atob(dataURI.split(',')[1])
  // Create 8-bit unsigned array
  var array = []
  for (var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i))
  // create blob
  return new Blob([new Uint8Array(array)], {type: 'image/' + imageFormat})
}