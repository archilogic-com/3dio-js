window.io3dAframeLightBaking = (function(){

  // initialize when inspector loaded

  if (AFRAME && AFRAME.INSPECTOR && AFRAME.INSPECTOR.opened === true) {
    init()
  } else {
    window.addEventListener('inspector-loaded', init)
  }

  // methods

  function init() {
    createDomElements()
  }

  /**
   * @param selected - THREE.Object3D or DOM query string selector referencing A-Frame element
   */

  function bakeLightMaps (selected) {

    if (!selected) {
      io3d.utils.ui.message.error('Please select a group or a single object.')
      return
    }

    if (typeof selected === 'string') {
      selected = document.querySelector(selected).object3D
    }

    // run

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
      console.log('Imported file: ' + io3d.utils.data3d.getInspectorUrl(storageId))

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
      console.log('Baked file: ' + io3d.utils.data3d.getInspectorUrl(bakedStorageId))

      uiMessage.close()
      io3d.utils.ui.message.success('Baking Successful')


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

  function createDomElements () {

    var style = document.createElement('style')
    style.innerHTML = [
      '#baking-module { font-family: Roboto, BlinkMacSystemFont, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; position: absolute; top: 0px; left: 246px; z-index: 100000; }',
      '#baking-module__main-bar span, #baking-module__main-bar a { display: inline-block; height: 33px; line-height: 33px; padding: 0 12px 0 12px; margin: 0 0 0 0; border-left: 1px solid rgba(255,255,255,0.5); white-space: nowrap; font-weight: 400; letter-spacing: 1px; font-size: 12px; color: white; background-color: rgba(0,0,0,0.8); }',
      '#baking-module__bake-button { display: inline-block; cursor: pointer; text-decoration: none; color: white; font-size: 16px; font-weight: 500; letter-spacing: 0px; height: 38px; line-height: 40px; padding: 0 13px 0 13px; background-color: #1faaf2; border-radius: 2px; margin: 16px 0 0 0; position: relative; left: 2px; top: -2px; box-shadow: -2px 2px 0px 0px #105576; }',
      '#baking-module__bake-button:hover { background-color: #44c3f2; }',
      '#baking-module__bake-button:active { left: -1px; top: 1px; background-color: #105576; box-shadow: -2px 2px 0px 0px rgba(0, 0, 0, 0); }'
    ].join('\n')
    document.body.append(style)

    var menuTop = document.createElement('div')
    menuTop.id = 'baking-module'
    document.body.append(menuTop)

    var mainBar = document.createElement('div')
    mainBar.id = 'baking-module__main-bar'
    menuTop.append(mainBar)

    var buttons = {
      // text : url
      'Light Baking API 🔥': null,
      'docs': 'https://3d.io/docs/api/1',
      'github': 'https://github.com/archilogic-com/3dio-light-baking-app/',
      'API key': 'https://3d.io'
    }

    Object.keys(buttons).forEach(function(text){
      var url = buttons[text]
      var button = document.createElement(url ? 'a' : 'span')
      if (url) button.setAttribute('href', url)
      button.innerHTML = text
      mainBar.append(button)
    })

    var bakeButton = document.createElement('div')
    bakeButton.id = 'baking-module__bake-button'
    bakeButton.innerHTML = 'BAKE'
    bakeButton.addEventListener('click', function(){
      bakeLightMaps(AFRAME.INSPECTOR.selected)
    })
    menuTop.append(bakeButton)

  }

  // expose API

  return {
    init: init,
    bakeLightMaps: bakeLightMaps
  }

})()