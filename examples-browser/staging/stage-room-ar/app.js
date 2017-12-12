// set api keys
io3d.config({
  // home staging need api keys
  // get yours from https://3d.io
  publishableApiKey: null
})

// UI elements
var toolButtons = document.querySelectorAll('.btn-tool')
var styleButtons = document.querySelectorAll('.btn-style')
var btnFurnishEl = document.querySelector('#furnish')
var btnBuildEl = document.querySelector('#build')
var btnFloorPlanEl = document.querySelector('#floorplan')
var btnRestartEl = document.querySelector('#restart')
var controlsEl = document.querySelector('.controls')
var toolsEl = document.querySelector('#tools')
var stylesEl = document.querySelector('#styles')

// aframe elements
var rayCasterEl = document.querySelector('#raycaster')
var sceneEl = document.querySelector('a-scene')
var camEl = document.querySelector('a-camera')
var planeEl = document.querySelector('a-plane')
var furnishingEl = document.querySelector('#furnishings')
var structureEl = document.querySelector('#structure')
var drawingEl = document.querySelector('#drawing')
var cursor3dEl = document.querySelector('#cursor-3d')
var canvasEl

// inital settings
var isMobile = AFRAME.utils.device.isMobile()
if (isMobile) {
  rayCasterEl.setAttribute('cursor', {rayOrigin: 'entity', fuse: false})
  // rayCasterEl.setAttribute('geometry', {primitive: 'sphere', radius: 0.01})
  // add shadow material to plane
  planeEl.setAttribute('shadow-material', true)
  // wait for aframe to load to get the canvas
  document.querySelector('a-scene').addEventListener('loaded', initTracking)
} else {
  document.querySelector('a-scene').addEventListener('loaded', function () {
    io3d.utils.ui.message('click on the floor to draw a wall')
    initDrawing()
  })
}

// internals
var points = []
var drawMode = null
var sceneStructure
var addedItems = []
var initMsg

// bind events
toolButtons.forEach(btn => {
  btn.addEventListener('click', switchMode)
})
styleButtons.forEach(btn => {
  btn.addEventListener('click', changeStyle)
})
rayCasterEl.addEventListener('click', addPoint)
btnFurnishEl.addEventListener('click', getFurnishing)
btnBuildEl.addEventListener('click', buildStructure)
btnFloorPlanEl.addEventListener('click', getFloorPlan)
btnRestartEl.addEventListener('click', restart)

// workaround to get the initial plane position
function initTracking () {
  initMsg = io3d.utils.ui.message('tap on a floor to initialize')
  canvasEl = document.querySelector('canvas')
  canvasEl.addEventListener('touchstart', hitTest, false)
}

function initDrawing () {
  rayCasterEl.setAttribute('visible', true)
  controlsEl.style.display = 'block'
}

function addPoint (e) {
  // get data from 3d cursor
  const hitWall = cursor3dEl.components['cursor-3d'].hitWall
  const position = cursor3dEl.getAttribute('position') //components['cursor-3d'].position
  if (drawMode === 'wall' || drawMode === 'window' || drawMode === 'door') points.push(position)
  // position.y += 0.025
  if (drawMode === 'wall' && points.length >= 2) {
    var i = points.length - 1
    // add a wall
    addLine({start: points[i - 1], end: points[i], color: '#222'})
    if (hitWall) points = []
  } else if (hitWall && drawMode && points.length === 2) {
    let i = points.length - 1
    let color = drawMode === 'window' ? '#ddd' : '#f0f0f0'
    let type = drawMode === 'window' ? 'window' : 'door'
    let pW = hitWall.getAttribute('position')
    // verify that points are in the correct order
    let flipPoints = distance(points[i - 1], pW) < distance(points[1], pW)
    let p1 = {x: distance(points[i - 1], pW), y: 0.01, z: 0}
    let p2 = {x: distance(points[1], pW), y: 0.01, z: 0}
    let start = flipPoints ? p1 : p2
    let end = flipPoints ? p2 : p1
    // add a window or door to the corresponding wall
    addLine({start, end, color, type, parent: hitWall})
    points = []
  }
}

function addLine (args) {
  var
    start = args.start,
    end = args.end,
    type = args.type,
    color = args.color || 'white',
    parent = args.parent || drawingEl
  box = document.createElement('a-entity'),
    l = distance(start, end),
    angle = pointAngle(start, end),
    w = 0.1,
    h = 0.005

  box.setAttribute('position', AFRAME.utils.coordinates.stringify(start))
  box.setAttribute('rotation', `0 ${angle} 0`)
  box.setAttribute('line-element', {
    type: type,
    l,
    w,
    h,
    color: color
  })
  box.setAttribute('class', 'collidable')
  parent.appendChild(box)
}

function getFurnishing () {

  // convert drawn aframe elements into scene structure
  getSceneStructure()
  // send sceneStructure to home staging ai
  // optional set space label: io3d.staging.getFurnishings(result, {label: bedroom})
    .then(result => {
      var messages = [
        'looking for furniture at the conference',
        'buying furniture from nearby store',
        'calling an interior designer',
        'there is a chair, there is a sofa ... ',
        'You said you want furniture?',
        'How about something that goes really well with the floor?'
      ]
      var space = result.find(el => el.type === 'polyfloor')
      var area = space && getPolygonArea(space.polygon)
      var label = 'dining_living'
      if (area && area < 15) {
        io3d.utils.ui.message('That is a tiny tiny room')
        label = 'dining'
      }
      io3d.utils.ui.message(messages[Math.floor(Math.random() * messages.length)])
      console.log(area, label)
      return io3d.staging.getFurnishings(result, {spaceId: space.id, label: label})
    })
    // update sceneStructure for later use
    .then(result => {
      // let's hide the drawing on mobile
      if (isMobile) drawingEl.setAttribute('visible', false)
      cursor3dEl.setAttribute('visible', false)
      toolsEl.style.display = 'none'
      stylesEl.style.display = 'block'
      rayCasterEl.removeEventListener('click', addPoint)
      sceneStructure = result
      return result
    })
    .then(placeFurniture)
    .catch(err => {
      io3d.utils.ui.message.error('nothing found - room too small?')
      console.log(err)
    })
}

function changeStyle (e) {
  var style = e.srcElement.id
  if (!sceneStructure) return
  io3d.staging.replaceFurniture(sceneStructure, {query: style})
    .then(placeFurniture)
    .catch(err => {
      console.log(err)
    })
}

function placeFurniture (input) {
  // convert sceneStructure to aframe Html so we can place it in the scene
  var elements = io3d.scene.getAframeElementsFromSceneStructure(input)
  // check for previously added elements and remove them
  addedItems.forEach(el => {
    el.parentNode.removeChild(el)
  })
  // add elements to the scene
  elements.forEach(el => {
    furnishingEl.appendChild(el)
  })
  // store added elements for later removal
  addedItems = elements
}

function getSceneStructure () {
  console.log('getting sceneStructure')
  let _sceneStructure = []
  const elements = document.querySelectorAll('a-entity[line-element]')
  elements.forEach(el => {
    let data = getElement3d(el)
    if (data.type === 'wall') {
      data.children = []
      const children = el.childNodes
      children.forEach(c => {
        data.children.push(getElement3d(c))
      })
      _sceneStructure.push(data)
    }
  })
  // snap walls
  _sceneStructure = io3d.scene.snapWalls(_sceneStructure)
  _sceneStructure = JSON.parse(JSON.stringify(_sceneStructure))
  // FIXME: workaround for offline support
  // return Promise.resolve(sceneStructure)
  // get polygonal floor
  return io3d.utils.services.call('Recognizer.recognizeFloors', {
    walls: _sceneStructure.filter(el3d => el3d.type === 'wall')
  })
    .then(floors => {
      if (floors.length === 0) {
        io3d.utils.ui.message.error('walls are not closed - try again', {expire: 2000})
      }
      return Promise.resolve(_sceneStructure.concat(floors))
    })
    // normalize scene structure ( add default values and uuids )
    .then(io3d.scene.normalizeSceneStructure)
}

function buildStructure () {
  const visible = structureEl.getAttribute('visible')
  if (visible) {
    structureEl.setAttribute('visible', false)
    return
  } else {
    structureEl.setAttribute('visible', true)
  }
  while (structureEl.firstChild) {
    structureEl.removeChild(structureEl.firstChild)
  }
  getSceneStructure()
    .then(result => {
      const elements = io3d.scene.getAframeElementsFromSceneStructure(result)
      elements.forEach(el => {
        structureEl.appendChild(el)
      })
    })
    .catch(console.error)
}

function getFloorPlan () {
  console.log('get floorplan')
  const svgEl = document.querySelector('#svg-container')
  if (svgEl.style.display === 'block') {
    svgEl.style.display = 'none'
    svgEl.innerHTML = ''
    toolsEl.style.display = 'block'
    btnFurnishEl.style.display = 'block'
    btnBuildEl.style.display = 'block'
    return
  }
  getSceneStructure()
    .then(result => {
      var space = result.find(el => el.type === 'polyfloor')
      if (!space) {
        io3d.utils.ui.message.error('try to close the room first')
        return
      }
      toolsEl.style.display = 'none'
      btnFurnishEl.style.display = 'none'
      btnBuildEl.style.display = 'none'

      var message = {
        method: 'svgFloorPlan',
        params: {sceneStructure: result},
        jsonrpc: '2.0',
        id: Math.round(Math.random() * 1e20)
      }

      return fetch('https://io3d-tasks.herokuapp.com/', {
        method: 'POST', body: JSON.stringify(message)
      }).then(function (response) {
        return response.json()
      }).then(function (body) {
        return body.result
      }).catch(console.error)
    })
    .then(svgStr => {
      svgEl.style.display = 'block'
      svgEl.innerHTML = svgStr
    })
    .catch(console.error)
}

function switchMode (e) {
  var el = e.srcElement
  points = []
  if (el.id === drawMode) {
    drawMode = null
    el.classList.remove('active')
  } else {
    drawMode = el.id
    el.classList.add('active')
    toolButtons.forEach(btn => {
      if (btn.id !== el.id) btn.classList.remove('active')
    })
  }
  console.log(el.id, drawMode)
}

function hitTest (e) {
  console.log('click')
  if (!e.touches[0]) {
    return
  }
  var x = e.touches[0].pageX / window.innerWidth
  var y = e.touches[0].pageY / window.innerHeight
  console.log(x, y)
  var vrDisplay = camEl.components.camera.camera.vrDisplay
  var hits = vrDisplay.hitTest(x, y)
  if (hits && hits.length) getPosFromHit(hits)
  else io3d.utils.ui.message.error('try again - ideally standing', {expire: 2000})
}

function getPosFromHit (hits) {
  // lets choose the last one which is most likely the floor
  console.log(hits.length, 'hits')
  var hit = hits[hits.length - 1]
  if (!hit || !hit.modelMatrix) {
    throw new Error('placeObjectAtHit requires a VRHit object')
  }
  const model = new THREE.Matrix4()
  const tempPos = new THREE.Vector3()
  const tempQuat = new THREE.Quaternion()
  const tempScale = new THREE.Vector3()

  model.fromArray(hit.modelMatrix)
  model.decompose(tempPos, tempQuat, tempScale)

  planeEl.setAttribute('position', AFRAME.utils.coordinates.stringify(tempPos))
  furnishingEl.setAttribute('position', `0 ${tempPos.y} 0`)
  structureEl.setAttribute('position', `0 ${tempPos.y} 0`)
  canvasEl.removeEventListener('touchstart', hitTest, false)
  initMsg.close()
  io3d.utils.ui.message.success('floor detected - start', {expire: 1000})

  // show drawing menu and cursor
  setTimeout(function () {
    initDrawing()
  }, 1000)
}

function restart () {
  drawingEl.setAttribute('visible', true)
  cursor3dEl.setAttribute('visible', true)
  toolsEl.style.display = 'block'
  stylesEl.style.display = 'none'
  rayCasterEl.addEventListener('click', addPoint)
  const svgEl = document.querySelector('#svg-container')
  sceneStructure = null
  addedItems.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  addedItems = []
  const elements = document.querySelectorAll('a-entity[line-element]')
  const walls = document.querySelectorAll('[io3d-wall]')
  const floors = document.querySelectorAll('[io3d-polyfloor]')
  elements.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  walls.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  floors.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  svgEl.style.display = 'none'
}

// helper functions

function pointAngle (u, v) {
  if (!u) u = {x: 0, z: 0}
  return round((Math.atan2(-v.z + u.z, v.x - u.x)) * 180 / Math.PI)
}

function distance (a, b) {
  var dist = Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - a.y), 2) + Math.pow((b.z - a.z), 2))
  return dist
}

function round (a, factor) {
  if (!factor) factor = 1e2
  return Math.round(a * factor) / factor
}