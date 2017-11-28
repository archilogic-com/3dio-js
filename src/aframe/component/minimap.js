import cloneDeep from 'lodash/cloneDeep'

export default {
  schema: {
    sceneId: {
      type: 'string'
    },
    rotation: {
      type: 'number',
      default: 0
    },
    width: {
      type: 'number',
      default: 150
    },
    position: {
      type: 'string',
      default: 'left',
      oneOf: ['left', 'right']
    }
  },
  init: function () {
    var this_ = this
    var data = this.data

    // get scene structure
    io3d.scene.getStructure(data.sceneId)
      .then(result => {
        //this.sceneStructure = result
        if (!Array.isArray(result)) result = [result]
        // find all spaces in the model
        let spaces = getSpaces(result)
        // apply plan rotation / position

        if (!spaces || !spaces.length) {
          return Promise.reject('Minimap generation failed, scene has no spaces')
        }
        spaces = spaces.map(space => {
          let location = applyLocation(space, result[0])
          Object.keys(location).forEach(prop => {
            space[prop] = location[prop]
          })
          //console.log(' ' + space.ry)
          return space
        })
        setupMap()
        // generate a clickable plan
        generatePlan(spaces, this.svgEl)
      })
      .catch(console.warn)

    function setupMap () {
      // get camera
      var cameras = document.querySelectorAll('[camera]')
      // pick the last camera
      // TODO: better to pick the active one
      this_.camera = cameras.length > 1 ? cameras[1] : cameras[0]
      // console.log('loading minimap', data)
      // console.log('loading minimap', cameras, this_.camera.getAttribute('position'))
      // create html container for minimap
      var container = document.createElement('div')
      container.id = 'minimap-container'
      container.setAttribute('style', `position:absolute; width: ${data.width}px; z-index: 1000; top:10px; ${data.position}:10px`)
      container.innerHTML = `<svg width="100%"></svg>`
      // put container as first child in body
      var body = document.querySelector('body')
      body.insertBefore(container, body.firstChild)
      // bind svg element with component
      this_.svgEl = container.querySelector('svg')
      this_.svgEl.setAttribute('style', `transform: rotate(${data.rotation}deg);`)
    }
    // generate a pictogram of the floor plan
    function generatePlan (spaces, svgEl) {
      // empty svg element to fill
      this_.min = [Infinity, Infinity]
      this_.max = [-Infinity, -Infinity]
      var polygonStr = ''

      const style1 = 'fill:rgba(248, 248, 250, 0.8); stroke:rgba(48, 48, 50, 0.8); stroke-width:0.5;'
      const style2 = 'fill:rgba(255, 127, 80, 0.8);'

      spaces.forEach(space => {
        var pointStr = ''
        // get the polygon data for each space
        space.polygon.forEach(point => {
          // get absolute coordinates and map z to y
          // polygon points are relative to the polygon position
          var location = applyLocation({x: point[0], z: point[1]}, space)
          var x = Math.round(location.x * 20)
          var y = Math.round(location.z * 20)
          // get min and max values for the overall boundingbox
          if (x < this_.min[0]) this_.min[0] = x
          else if (x > this_.max[0]) this_.max[0] = x
          if (y < this_.min[1]) this_.min[1] = y
          else if (y > this_.max[1]) this_.max[1] = y
          pointStr += x + ',' + y + ' '
        })
        polygonStr += `<polygon points="${pointStr}" style="${style1}" space-id="${space.id}"/>`
      })
      // populate the svg
      svgEl.innerHTML = polygonStr
      // match the svg viewbox with the bouningbox of the polygons
      svgEl.setAttribute('viewBox', `${this_.min[0]} ${this_.min[1]} ${this_.max[0] - this_.min[0]} ${this_.max[1] - this_.min[1]}`)

      // start position tracking
      this_.mapActivated = true
      this_.el.emit('minimap-created')
    }

    function applyLocation (element, parent) {

      // Rotate look-at point on the XZ plane around parent's center
      var angleY = -parent.ry * Math.PI / 180

      var rotatedX = element.x * Math.cos(angleY) - element.z * Math.sin(angleY)
      var rotatedZ = element.z * Math.cos(angleY) + element.x * Math.sin(angleY)

      // Get world space coordinates for our look-at point
      var location = {}
      location.x = parent.x + rotatedX
      if (element.y !== undefined) location.y = parent.y + element.y
      location.z = parent.z + rotatedZ
      if (element.ry !== undefined) location.ry = parent.ry + element.ry
      return location
    }

    function getSpaces (sceneStructure) {
      var spaces = []
      sceneStructure.forEach(element3d => {
        if (element3d.type === 'polyfloor') spaces.push(element3d)
        if (element3d.children && element3d.children.length) {
          spaces = spaces.concat(getSpaces(element3d.children))
        }
      })
      return spaces
    }
  },
  remove: function() {
    var minimapEl = document.querySelector('#minimap-container')
    minimapEl.parentNode.removeChild(minimapEl)
  },
  tick: function (time, timeDiff) {
    if (!this.mapActivated) return

    // update dot every 100 ms
    if (time % 50 < timeDiff + 5) {
      var cameraDot = this.svgEl.querySelector('#camera-dot')
      var cameraPos = this.camera.getAttribute('position')
      var cameraRot = this.camera.getAttribute('rotation')
      // make sure our point stays within the map
      var pointPos = cloneDeep(cameraPos)
      if (pointPos.x * 20 < this.min[0]) pointPos.x = this.min[0] / 20
      else if (pointPos.x * 20 > this.max[0]) pointPos.x = this.max[0] / 20
      if (pointPos.z * 20 < this.min[1]) pointPos.z = this.min[1] / 20
      else if (pointPos.z * 20 > this.max[1]) pointPos.z = this.max[1] / 20

      // console.log(cameraPos)
      if (!cameraDot) {
        console.log('create dot')
        this.svgEl.innerHTML +=
          `<g id="camera-dot" transform="translate(30,30) rotate(80)">
	<circle cx="0" cy="0"	r="5" fill="CadetBlue"/>
	<polygon points="0,0 50,-40 50,40" fill="url(#Gradient)" />
</g>
<defs>
  <linearGradient id="Gradient" x1="0" x2="1" y1="0" y2="0">
     <stop offset="0%" stop-color="CadetBlue"/>
     <stop offset="100%" stop-color="CadetBlue" stop-opacity="0"/>
  </linearGradient>
</defs>`
        // circle cx="150" cy="50" r="40"
      } else {
        cameraDot.setAttribute('transform', `translate(${pointPos.x * 20},${pointPos.z * 20}) rotate(${-cameraRot.y - 90})`)
      }
    }
  }
}