import cloneDeep from 'lodash/cloneDeep'
import materialDefinitions from './material-definitions/mat-lib.js'
import getType from './get-type.js'
import getSchema from './get-schema.js'

function getElementComponent(type) {
  return {
    schema: getSchema.get(type),

    init: function () {
    },

    update: function () {
      var this_ = this
      var el = this.el
      var data = this.data
      var materials = data.materials
      var initEl3d = getType.init

      var a, el3d, meshes, materials, data3d

      // get default values
      var elType = getType.get(type)
      if (!elType) {
        console.log('invalid type', type)
        return
      }

      var a = elType.params
      // apply entity values
      a = mapAttributes(a, data)

      if (materials && materials !== '') {
        materials = parseMats(materials)
        console.log(a.type, materials)
        Object.keys(materials).forEach(key => {
          a.materials[key] = materials[key]
        })
      }

      // get children for walls
      if (type === 'wall') {
        var children = this_.el.children
        var _children = []
        if (children && children.length > 0) {
          for (var i = 0; i < children.length; i++) {
            var c = children[i].getAttribute('io3d-window') || children[i].getAttribute('io3d-door')
            if (c) {
              if (children[i].getAttribute('io3d-window')) c.type = 'window'
              else if (children[i].getAttribute('io3d-door')) c.type = 'door'
              var pos = children[i].getAttribute('position')
              Object.keys(pos).forEach(p => {
                c[p] = pos[p]
              })
              _children.push(c)
            } else console.log('invalid child')
          }

          // apply defaults and map attributes
          _children = _children.map(c => mapAttributes(cloneDeep(getType.get(c.type).params), c))
          // console.log('children', _children)
          a.children = _children
        } else a.children = []
      }

      initEl3d.prototype.meshes3d = elType.meshes3d
      initEl3d.prototype.materials3d = elType.materials3d

      // get new instance
      el3d = new initEl3d(a)

      // get meshes and materials from el3d modules
      var meshes = el3d.meshes3d()
      var materials = el3d.materials3d()

      // fetch materials from mat library
      Object.keys(materials).forEach(mat => {
        materials[mat] = getMaterial(materials[mat])
      })

      // construct data3d object
      data3d = {
        meshes: meshes,
        materials: materials
      }

      // remove old mesh
      this_.remove()

      // create new one
      this_.mesh = new THREE.Object3D()
      this_.data3dView = new IO3D.aFrame.three.Data3dView({parent: this_.mesh})

      // update view
      this_.data3dView.set(data3d)
      this_.el.setObject3D('mesh', this_.mesh)
      // emit event
      this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
    },

    remove: function () {
      if (this.data3dView) {
        this.data3dView.destroy()
        this.data3dView = null
      }
      if (this.mesh) {
        this.el.removeObject3D('mesh')
        this.mesh = null
      }
    }
  }
}

export default getElementComponent

function getMaterial(material) {
  var mat = materialDefinitions[material]
  if (!mat) return material
  var attr = cloneDeep(mat.attributes)
  Object.keys(attr).forEach(a => {
    // get textures
    if (a.indexOf('map') > -1 ) {
    // fix to prevent double slash
    if (attr[a][0] === '/') attr[a] = attr[a].substring(1)
    // get full texture path
    attr[a] = 'https://storage.3d.io/' + attr[a]
  }
})
  return attr
}

function mapAttributes(a, args) {
  // set custom attributes
  var validProps = getSchema.validProps
  var _type = a.type
  Object.keys(args).forEach(prop => {
    if (validProps[_type].indexOf(prop) > -1 && (args[prop] || args[prop] === 0)) {
      if (prop === 'polygon') a[prop] = parsePolygon(args[prop])
      else a[prop] = args[prop]
    }
  })
  return a
}

function parseMats(mats) {
  var _mats = mats.split(',')
  var matObj = {}
  _mats.forEach(m => {
    var key = m.split('=')[0]
    var val = m.split('=')[1]
    matObj[key] = val
  })
  return matObj
}

function parsePolygon(p) {
  var _p = p.split(',')
  var polygon = []
  for (var i = 0; i < _p.length - 1; i+=2 ) {
    polygon.push([_p[i],_p[i+1]])
  }
  // polygons might have duplicate points ( start, end )
  // better to remove that to prevent errors
  var duplicatePoint = polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1]
  if (duplicatePoint) polygon.splice(-1, 1)
  return polygon
}