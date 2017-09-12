// UI elements
var toolButtons = document.querySelectorAll('.btn-tool')
var styleButtons = document.querySelectorAll('.btn-style')
var btnFurnishEl = document.querySelector('#furnish');
var controlsEl = document.querySelector('.controls');
var toolsEl = document.querySelector('#tools');
var stylesEl = document.querySelector('#styles');

// aframe elements
var rayCasterEl = document.querySelector('#raycaster');
var sceneEl = document.querySelector('a-scene');
var camEl = document.querySelector('a-camera');
var planeEl = document.querySelector('a-plane');
var furnishingEl = document.querySelector('#furnishings');
var drawingEl = document.querySelector('#drawing');
var canvasEl

// inital settings
var isMobile = AFRAME.utils.device.isMobile()
if (isMobile) {
  rayCasterEl.setAttribute('cursor', {rayOrigin: 'entity', fuse: false})
  rayCasterEl.setAttribute('geometry', {primitive: 'sphere', radius: 0.01})
  // add shadow material to plane
  planeEl.setAttribute('shadow-material', true)
  // wait for aframe to load to get the canvas
  document.querySelector('a-scene').addEventListener('loaded', initTracking)
} else {
  document.querySelector('a-scene').addEventListener('loaded', function() {
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

// workaround to get the initial plane position
function initTracking() {
  initMsg = io3d.utils.ui.message('tap on a floor to initialize')
  canvasEl = document.querySelector('canvas');
  canvasEl.addEventListener('touchstart', hitTest, false);
}

function initDrawing() {
  rayCasterEl.setAttribute('visible', true)
  controlsEl.style.display = 'block'
}

function addPoint(e) {
  let intersectedEl = e.detail.intersectedEl
  let hitLine = intersectedEl.getAttribute('line-element')
  let position = e.detail.intersection.point

  if (drawMode === 'wall' || hitLine) points.push(position)
  // position.y += 0.025
  if (drawMode === 'wall' && points.length >= 2) {
    var i = points.length - 1
    addLine({start: points[i - 1], end: points[i], color: '#222'})
    if (hitLine) points = []
  } else if (drawMode && points.length === 2) {
    let i = points.length - 1
    let color = drawMode === 'window' ? '#ddd' : '#f0f0f0'
    let type = drawMode === 'window' ? 'window' : 'door'
    let start = {x: distance(points[i - 1], intersectedEl.getAttribute('position')), y:0.01, z:0}
    let end = {x: distance(points[1], intersectedEl.getAttribute('position')), y:0.01, z:0}
    addLine({start, end, color, type, parent: intersectedEl})
    points = []
  }
}

function addLine(args) {
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

function getFurnishing() {
  // let's hide the drawing on mobile
  if (isMobile) drawingEl.setAttribute('visible', false)
  toolsEl.style.display = 'none'
  stylesEl.style.display = 'block'

  // convert drawn aframe elements into scene structure
  getSceneStructure()
    // normalize scene structure ( add default values and uuids )
    .then(io3d.scene.normalizeSceneStructure)
    // send sceneStructure to home staging ai
    // optional set space label: io3d.staging.getFurnishings(result, {label: bedroom})
    .then(io3d.staging.getFurnishings)
    // update sceneStructure for later use
    .then(result => {
      sceneStructure = result
      return result
    })
    .then(placeFurniture)
    .catch(err => {
      console.log(err)
    })
}

function changeStyle(e) {
  var style = e.srcElement.id
  if (!sceneStructure) return
  io3d.staging.replaceFurniture(sceneStructure, {query: style})
    .then(placeFurniture)
    .catch(err => {
      console.log(err)
    })
}

function placeFurniture(input) {
  // convert sceneStructure to aframe Html so we can place it in the scene
  var elements = io3d.scene.getHtmlFromSceneStructure(input)
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

function getSceneStructure() {
  var sceneStructure = []
  walls = document.querySelectorAll('a-entity[line-element]')
  walls.forEach(w => {
    let data = getData(w)
    if (data.type === 'wall') {
    data.children = []
    let children = w.childNodes
    children.forEach(c => {
      data.children.push(getData(c))
  })
    sceneStructure.push(data)
  }
})
  // get polyfloors
  return io3d.utils.services.call('Recognizer.recognizeFloors', {
    walls: sceneStructure
  }).then(floors => {
    if (floors.length === 0 ) {
      io3d.utils.ui.message.error('walls are not closed - try again', { expire: 2000 })
      return Promise.reject(new Error('walls are not closed'))
    }
  return sceneStructure.concat(floors)
})
}

function getData(el) {
  let data = el.getAttribute('line-element')
  delete data.color
  let pos = el.getAttribute('position')
  let rot = el.getAttribute('rotation')

  // clean up data
  if (data.type === 'wall') {
    data.h = 2.4
    data.y = 0
  } else if (data.type === 'door') {
    data.h = 2
    data.y = 0
  } else if (data.type === 'window') {
    data.h = 1.5
    data.y = 0.9
  }
  data.x = round(pos.x)
  data.y = round(pos.y)
  data.z = round(pos.z)
  data.ry = round(rot.y)

  return data
}

function switchMode(e) {
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

function hitTest(e) {
  console.log('click')
  if (!e.touches[0]) {
    return;
  }
  var x = e.touches[0].pageX / window.innerWidth;
  var y = e.touches[0].pageY / window.innerHeight;
  console.log(x, y)
  var vrDisplay = camEl.components.camera.camera.vrDisplay
  var hits = vrDisplay.hitTest(x, y);
  if (hits && hits.length) getPosFromHit(hits)
  else io3d.utils.ui.message.error('try again - ideally standing', { expire: 2000 })
}

function getPosFromHit(hits) {
  // lets choose the last one which is most likely the floor
  console.log(hits.length, 'hits')
  var hit = hits[hits.length - 1]
  if (!hit || !hit.modelMatrix) {
    throw new Error('placeObjectAtHit requires a VRHit object');
  }
  const model = new THREE.Matrix4();
  const tempPos = new THREE.Vector3();
  const tempQuat = new THREE.Quaternion();
  const tempScale = new THREE.Vector3();

  model.fromArray(hit.modelMatrix);
  model.decompose(tempPos, tempQuat, tempScale);

  planeEl.setAttribute('position', AFRAME.utils.coordinates.stringify(tempPos))
  furnishingEl.setAttribute('position', `0 ${tempPos.y} 0`)
  canvasEl.removeEventListener('touchstart', hitTest, false);
  initMsg.close()
  io3d.utils.ui.message.success('floor detected - start', { expire: 1000 })

  // show drawing menu and cursor
  setTimeout(function() {
    initDrawing()
  }, 1000)
}

// helper functions

function pointAngle(u, v) {
  if (!u) u = {x: 0, z:0}
  return round((Math.atan2(-v.z + u.z, v.x - u.x)) * 180 / Math.PI);
}

function distance(a, b) {
  var dist = Math.sqrt(Math.pow((b.x-a.x),2) + Math.pow((b.y-a.y),2) + Math.pow((b.z-a.z),2))
  return dist
}

function round(a, factor) {
  if (!factor) factor = 1e2
  return Math.round(a * factor) / factor
}