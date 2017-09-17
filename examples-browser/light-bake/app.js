function onInspectorReady () {


}

function bakeLightMaps () {

  // var selected = document.querySelector('#some-entity').object3D
  var selected = AFRAME.INSPECTOR.selected

  if (!selected) {
    io3d.utils.ui.message.error('Please select a group or a single object.')
    return
  }

  var timestamp, previousTimestamp = Date.now()
  function getDuration () {
    timestamp = Date.now()
    duration = timestamp - previousTimestamp
    previousTimestamp = timestamp
    return Math.round(duration/1000) + 's'
  }

  var uiMessage = io3d.utils.ui.message('Light map baking in progress...', 0)

  io3d.publish(selected).then(function (storageId) {

    console.log('Imported model to as data3d: '+getDuration())

    return Promise.all([
      // send baking request and
      io3d.light.bake(storageId).then(io3d.light.bake.whenDone),
      // wait for hi-res DDS texture generation
      io3d.publish.whenHiResTexturesReady(storageId)
    ])

  }).then(function (results) {
    var bakedStorageId = results[0]

    timestamp = Date.now()
    console.log('Bake done: '+getDuration())

    uiMessage.close()

    io3d.utils.ui.message.success('Baking Successful')
    console.log('Baked file: ' + io3d.utils.data3d.getInspectorUrl(bakedStorageId))

    addBakedModelToScene(selected, bakedStorageId)

  }, io3d.utils.ui.message.error)

}

function addBakedModelToScene(selected, storageId) {

  var parent = selected.parent

  var boundingBox = new THREE.Box3().setFromObject(selected)
  var width = (boundingBox.max.x - boundingBox.min.x)
  var position = new THREE.Vector3(
    parent.position.x + width + width*0.2,
    parent.position.x,
    parent.position.z
  )

  // add baked element to aframe scene
  var bakedEl = document.createElement('a-entity')
  bakedEl.setAttribute('position', position)
  bakedEl.setAttribute('io3d-data3d', 'key:' + storageId + ';lightMapExposure:1.1;lightMapIntensity:0.85;')
  parent.el.append(bakedEl)

  // select baked file
  bakedEl.addEventListener('model-loaded', function(){
    AFRAME.INSPECTOR.selectEntity(bakedEl)
  })

}

// bind events

window.addEventListener('inspector-loaded', onInspectorReady)

document.querySelector('#bake-button').addEventListener('click', bakeLightMaps)