AFRAME.registerComponent('cursor-3d', {
  init: function () {
    var rayCasterEl = document.querySelector('#raycaster')
    rayCasterEl.addEventListener('raycaster-intersection', getPos)
    this.walls = document.querySelectorAll('a-entity[line-element]')
    this.wallData = []
    var self = this

    function getPos (e) {
      self.position = e.detail.intersections && e.detail.intersections[0].point
    }
  },
  tick: function (time, timeDiff) {
    const snapDistance = 0.3

    // query drawn elements in scene
    let _walls = document.querySelectorAll('a-entity[line-element]')
    if (_walls.length && _walls.length !== this.walls.length) {
      this.wallData = []
      _walls.forEach(wall => {
        let el3d = getElement3d(wall, true)
        if (el3d.type === 'wall') this.wallData.push({el3d, wall})
      })
    }
    // compute intersections
    this.wallData.forEach((data, i) => {
      if (drawMode !== 'wall') intPoint = pointOnWall(this.position, data.el3d)
      else intPoint = pointOnWall(this.position, data.el3d, 'snapToPoint')
      this.wallData[i].intPoint = intPoint
    })

    // get closest intersection
    this.wallData.sort((a, b) => {
      let distA = distance(this.position, a.intPoint)
      let distB = distance(this.position, b.intPoint)
      return distA < distB ? -1 : 1
    })

    // original position is set by raycaster
    // position is changed here if snapping is needed
    if (drawMode !== 'wall' && this.wallData.length) {
      // doors and windows always snap to walls
      this.position.x = this.wallData[0].intPoint.x
      this.position.z = this.wallData[0].intPoint.z
      this.hitWall = this.wallData[0].wall
    } else if (drawMode === 'wall' && this.wallData.length) {
      // check if were close to another wall end
      let doSnap = distance(this.position, this.wallData[0].intPoint) < snapDistance
      if (doSnap) {
        this.position.x = this.wallData[0].intPoint.x
        this.position.z = this.wallData[0].intPoint.z
        this.hitWall = this.wallData[0].wall
      } else this.hitWall = null
    } else this.hitWall = null

    this.el.setAttribute('position', this.position)
  }
})