import checkDependencies from '../check-dependencies.js'

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

    this.el.setAttribute('animation__move', { startEvents: 'doNotFire', property: 'position', easing: 'easeInOutSine', dur: 100 }) //'property:position; easing:easeInOutSine; dur:100;')
    this.el.setAttribute('animation__turn', { property: 'rotation', easing: 'easeInOutSine', dur: 100 })//'property:rotation; easing:easeInOutSine; dur:100;')
    this._nextWaypointHandler = this._nextWaypoint.bind(this)
    this._currentWayPoint = -1
  },

  update: function () {
    this._waypoints = Array.from(this.el.querySelectorAll('[tour-waypoint]'))

    if(this.data.autoStart) {
      this.playTour()
    }
  },

  playTour: function () {
    console.log('alright', this._currentWayPoint)
    this._isPlaying = true
    this.el.addEventListener('animation__move-complete', this._nextWaypointHandler)
    var next = this._waypoints[++this._currentWayPoint]
    if(next) this.goTo(next.getAttribute('tour-waypoint'), true)
    else if(this.data.loop) {
      this._currentWayPoint = 0
      this.goTo(this._waypoints[0].getAttribute('tour-waypoint'), true)
    }
  },

  stopTour: function () {
    this.el.removeEventListener('animation__move-complete', this._nextWaypointHandler)
    this._isPlaying = false
  },

  goTo: function (label, keepPlaying) {
    this._isPlaying = !!keepPlaying
    var target = this._waypoints.find(function (item) { return item.getAttribute('tour-waypoint') === label })
    if(!target) {
      console.error('The given waypoint '+ label + ' does not exist. Available waypoints:', this._waypoints.map(function (elem) { elem.getAttribute('tour-waypoint') }))
      return
    }

    this.animate(target)
  },

  animate: function (bookmark) {
    var entity = this.el
    var newPosition = bookmark.getAttribute('position')
    var newRotation = bookmark.getAttribute('rotation')
    var currentPosition = entity.getAttribute('position')
    var currentRotation = entity.getAttribute('rotation')
    var startPosition = AFRAME.utils.coordinates.stringify(currentPosition)
    var startRotation = AFRAME.utils.coordinates.stringify(currentRotation)
    // compute distance to adapt speed
    var d = dist(currentPosition, AFRAME.utils.coordinates.parse(newPosition))
    // compute angle difference to adapt speed
    var angle = Math.abs(currentRotation.y - AFRAME.utils.coordinates.parse(newRotation).y)
    // compute animation time
    var t = Math.round((this.data.move || 3000) / 6 * (d + angle / 30))
    if (t > 10000) t = 10000
    // prevent zero length animation
    if (!t) return
    entity.components.animation__move.data.dur = t
    entity.components.animation__move.data.from = startPosition
    entity.components.animation__move.data.to = newPosition
    entity.components.animation__move.update()
    entity.components.animation__turn.data.dur = t
    entity.components.animation__turn.data.from = startRotation
    entity.components.animation__turn.data.to = newRotation
    entity.components.animation__turn.update()
    entity.components.animation__move.resumeAnimation()
    entity.components.animation__turn.resumeAnimation()
  },

  _nextWaypoint: function () {
    if(!this._isPlaying) return this.stop()
    if(this._currentWayPoint === this._waypoints.length - 1) {
      if(!this.data.loop) return
      this._currentWayPoint = -1
    }

    var next = this._waypoints[++this._currentWayPoint]
    setTimeout(function () { this.goTo(next.getAttribute('tour-waypoint'), this._isPlaying) }.bind(this), this.data.wait || 0)
  }
}

function dist(p, q) {
  var a = parseFloat(q.x) - parseFloat(p.x)
  var b = parseFloat(q.y) - parseFloat(p.y)
  var c = parseFloat(q.z) - parseFloat(p.z)
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2))
}
