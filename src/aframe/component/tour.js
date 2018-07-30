import clone from 'lodash/clone'
import defaults from 'lodash/defaults'

export default {
  schema: {
    autoStart: {
      type: 'boolean',
      default: true
    },
    loop: {
      type: 'boolean',
      default: true
    },
    wait: {
      type: 'number',
      default: 2000
    },
    move: {
      type: 'number',
      default: 3000
    }
  },

  init: function () {
    this._currentWayPoint = -1
    this._nextWaypointHandler = this._nextWaypoint.bind(this)
    this.el.addEventListener('nextTourPoint', this._nextWaypointHandler)
  },

  update: function () {
    this._waypoints = Array.from(this.el.querySelectorAll('[tour-waypoint]'))
    // with aframe >= 0.8.0 rotation possible only with look-controls
    if (!this.el.components["look-controls"]) this.el.setAttribute("look-controls", "")
    if(this.data.autoStart && this.el.components["look-controls"]) {
      this.playTour()
    }
  },

  playTour: function () {
    if (!this._waypoints || !this._waypoints.length) {
      console.warn('camera tour has no waypoints')
      return
    }
    if (this._isPlaying) {
      if(this._isChangingAnimation) {
        clearTimeout(this._nextAnimationTimeout)
        this.goTo(this._waypoints[this._currentWayPoint].getAttribute('io3d-uuid'), this._isPlaying)
      } else {
        if (this.positionAnimation) this.positionAnimation.play()
        if (this.rotationAnimationX) this.rotationAnimationX.play()
        if (this.rotationAnimationY) this.rotationAnimationY.play()
      }
      this._isPaused = false
    } else {
      this._isPlaying = true
      this._isPaused = false
      var next = this._waypoints[this._currentWayPoint + 1]
      if (next) this.goTo(next.getAttribute('io3d-uuid'), true)
      else if (this.data.loop) {
        this._currentWayPoint = 0
        this.goTo(this._waypoints[0].getAttribute('io3d-uuid'), true)
      }
    }
  },

  pauseTour: function () {
    this._isPaused = true
    if (this.positionAnimation) this.positionAnimation.pause()
    if (this.rotationAnimationX) this.rotationAnimationX.pause()
    if (this.rotationAnimationY) this.rotationAnimationY.pause()
  },

  stopTour: function () {
    this.pauseTour()
    this._isPlaying = false
    this._isPaused = false
  },

  goTo: function (uuid, keepPlaying) {
    this._isPlaying = !!keepPlaying
    var target = this._waypoints.find(function (item, index) {
      var isCurrent = item.getAttribute('io3d-uuid') === uuid
      if (isCurrent) this._currentWayPoint = index
      return isCurrent
    }.bind(this))
    if (!target) {
      console.error('The given waypoint ' + uuid + ' does not exist. Available waypoints:', this._waypoints.map(function (elem) { return elem.getAttribute('io3d-uuid') }))
      return
    }

    this.animate(target)
  },

  // set camera position and rotation by providing changes for certain axes
  // to reset camera to walking mode do:
  // updateViewPoint({position: {y:1.6}, rotation: {x:0})
  updateViewPoint: function (args) {
    args = args || {}
    if (typeof args !== 'object') {
      console.error('not supported camera view point: ' + args)
      return
    }
    var posChange = args.position || {}
    var rotChange = args.rotation || {}

    this._isPlaying = false
    // apply changes to current camera position
    var pos = defaults({}, posChange, clone(this.el.getAttribute('position')))
    var rot = defaults({}, rotChange, clone(this.el.getAttribute('rotation')))

    var target = {
      position: pos,
      rotation: rot
    }
    this.animate(target)
  },

  animate: function (bookmark) {
    var isDomElement = isElement(bookmark)
    var entity = this.el
    var newPosition = isDomElement ? bookmark.getAttribute('position') : bookmark.position
    var newRotation = isDomElement ? bookmark.getAttribute('rotation') : bookmark.rotation
    var startPosition = entity.getAttribute('position')
    // with aframe >= 0.8.0 rotation possible only with look-controls
    var controls = entity.components["look-controls"]
    var startRotation = {
      x: THREE.Math.radToDeg(controls.pitchObject.rotation.x),
      y: THREE.Math.radToDeg(controls.yawObject.rotation.y),
      z: 0,
    }
    var normalizedRotations = getNormalizeRotations(startRotation, newRotation)
    newRotation = normalizedRotations.end
    startRotation = normalizedRotations.start
    // compute distance to adapt speed
    var d = dist(startPosition, newPosition)
    // compute angle difference to adapt speed
    var angle = Math.abs(startRotation.y - newRotation.y)
    // compute animation time
    // add 1 to the this.data.move parameter to allow users to specify 0 without the animation cancelling out
    var t = Math.round((this.data.move === undefined ? 3000 : this.data.move + 1) / 6 * (d + angle / 30))
    if (t > Math.max(5000, this.data.move)) t = Math.max(5000, this.data.move)
    // prevent zero length animation
    if (!t) return this._nextWaypoint()
    if (this.positionAnimation) this.positionAnimation.pause()
    if (this.rotationAnimationX) this.rotationAnimationX.pause()
    if (this.rotationAnimationY) this.rotationAnimationY.pause()
    if (startRotation.x !== newRotation.x) {
      controls.pitchObject.rotation.x = THREE.Math.degToRad(startRotation.x)
      this.rotationAnimationX = window.anime({
        targets: controls.pitchObject.rotation,
        x: THREE.Math.degToRad(newRotation.x),
        duration: t,
        easing: 'linear',
      })
    }
    if (startRotation.y !== newRotation.y) {
      controls.yawObject.y = THREE.Math.degToRad(startRotation.y)
      this.rotationAnimationY = window.anime({
        targets: controls.yawObject.rotation,
        y: THREE.Math.degToRad(newRotation.y),
        duration: t,
        easing: 'linear',
      })
    }
    this.positionAnimation = window.anime({
      targets: entity.object3D.position,
      y: newPosition.y,
      x: newPosition.x,
      z: newPosition.z,
      duration: t,
      easing: 'linear',
      update: function (anim) {
        const value = anim.animatables[0].target
        if (
          entity.object3D.position.x === value.x &&
          entity.object3D.position.y === value.y &&
          entity.object3D.position.z === value.z
        ) return
        entity.object3D.position.set(value.x, value.y, value.z)
      }
    })
    this.positionAnimation.finished.then(function () {
      controls.yawObject.rotation.y = THREE.Math.degToRad(newRotation.y)
      controls.pitchObject.rotation.x = THREE.Math.degToRad(newRotation.x)
      entity.object3D.position.set(newPosition.x, newPosition.y, newPosition.z)
      this.rotationAnimationX = undefined
      this.rotationAnimationY = undefined
      this.positionAnimation = undefined
      entity.dispatchEvent(new CustomEvent('nextTourPoint'))
    }.bind(this))
    this._isChangingAnimation = false
  },

  _nextWaypoint: function () {
    // FIXME: Find the root cause of the weird jumpy behaviour when using WASD controls
    this.el.setAttribute('position', AFRAME.utils.coordinates.stringify(this.el.getAttribute('position')))

    if (!this._isPlaying) return this.stopTour()
    if (this._currentWayPoint === this._waypoints.length - 1) {
      if (!this.data.loop) return
      this._currentWayPoint = -1
    }
    this._isChangingAnimation = true
    var next = this._waypoints[++this._currentWayPoint]
    this._nextAnimationTimeout = setTimeout(function () {
      if (this._isPaused) return
      this.goTo(next.getAttribute('io3d-uuid'), this._isPlaying)
    }.bind(this), this.data.wait === undefined ? 0 : this.data.wait)
  }
}

// we want to prevent excessive spinning in rotations
function getNormalizeRotations(start, end) {
  // normalize both rotations
  var normStart = normalizeRotation(start)
  var normEnd = normalizeRotation(end)
  // find the shortest arc for each rotation
  Object.keys(start).forEach(function(axis) {
    if (normEnd[axis] - normStart[axis] > 180) normEnd[axis] -= 360
  })
  return { start: normStart, end: normEnd }
}

function normalizeRotation(rot) {
  return {
    x: rot.x % 360,
    y: rot.y % 360,
    z: rot.z % 360,
  }
}

function dist(p, q) {
  var a = parseFloat(q.x) - parseFloat(p.x)
  var b = parseFloat(q.y) - parseFloat(p.y)
  var c = parseFloat(q.z) - parseFloat(p.z)
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2))
}

// Returns true if it is a DOM element
// https://stackoverflow.com/a/384380/2835973
function isElement(o){
  var DOM_ELEMENT = 1
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === DOM_ELEMENT && typeof o.nodeName==="string"
  )
}
