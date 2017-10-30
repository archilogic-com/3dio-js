import cloneDeep from 'lodash/cloneDeep'
import materialDefinitions from './material-definitions/mat-lib.js'
import getType from './get-type.js'
import getSchema from './get-schema.js'
import getDefaultsByType from '../../../scene/structure/validate/get-defaults-by-type'

function getElementComponent(type) {
  return {
    schema: getSchema(type),

    init: function () {
      var this_ = this

      // listen for changes in child nodes ( windows, doors )
      var children = this.el.childNodes
      children.forEach(function(c) {
        console.log(c)
        c.addEventListener('componentchanged', function() {
          console.log('child updated')
          this_.updateElement()
        })
      })

      this.updateElement()
    },

    update: function (oldData) {
      if (!oldData || Object.keys(oldData).length === 0) return
      console.log('update')

      this.updateElement()
    },

    updateElement: function() {
      var this_ = this
      var data = this_.data
      var initEl3d = getType.init

      // get default values
      var elType = getType.get(type)
      if (!elType) {
        console.log('invalid type', type)
        return
      }

      initEl3d.prototype.meshes3d = elType.meshes3d
      initEl3d.prototype.materials3d = elType.materials3d

      // get new instance
      this.el3d = new initEl3d()

      // remove old mesh
      this.remove()

      // get defaults and
      // apply entity values
      var a = mapAttributes(cloneDeep(elType.params), data)

      // check for adapted materials
      var materialKeys = Object.keys(data).filter(function(key) {
        return key.indexOf('material_') > -1
      })
      // add materials to instance
      materialKeys.forEach(function(key) {
        var mesh = key.replace('material_', '')
        a.materials[mesh] = data[key]
      })

      // get children for walls
      if (type === 'wall') {
        var children = this_.el.children
        a.children = []
        for (var i = 0; i < children.length; i++) {
          var c = children[i].getAttribute('io3d-window') || children[i].getAttribute('io3d-door')
          if (c) {
            if (children[i].getAttribute('io3d-window')) c.type = 'window'
            else if (children[i].getAttribute('io3d-door')) c.type = 'door'
            var pos = children[i].getAttribute('position')
            Object.keys(pos).forEach(p => {
              c[p] = pos[p]
            })
            a.children.push(c)
          } else console.log('invalid child')
        }
        a.children = a.children.map(c => mapAttributes(cloneDeep(getType.get(c.type).params), c))
      }
      // set attributes
      this.el3d.a = a

      // get meshes and materials from el3d modules
      var meshes = this.el3d.meshes3d()
      var materials = this.el3d.materials3d()

      // clean up empty meshes to prevent errors
      var meshKeys = Object.keys(meshes)
      meshKeys.forEach(key => {
        if (!meshes[key].positions || !meshes[key].positions.length) {
          // console.warn('no vertices for mesh', key)
          delete meshes[key]
        }
      })

      // fetch materials from mat library
      Object.keys(materials).forEach(mat => {
        materials[mat] = getMaterial(materials[mat])
      })

      // construct data3d object
      var data3d = {
        meshes: meshes,
        materials: materials
      }

      // create new one
      this_.mesh = new THREE.Object3D()
      this_.data3dView = new IO3D.aFrame.three.Data3dView({parent: this_.mesh})

      // update view
      this_.data3dView.set(data3d)
      this_.el.setObject3D('mesh', this_.mesh)
      // emit event
      this_.el.emit('mesh-updated');
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
  var _type = a.type
  // get valid params for each type
  var validProps = getDefaultsByType(_type)
  var validKeys = Object.keys(validProps.params)
  Object.keys(args).forEach(prop => {
    // check if param is valid
    if (validKeys.indexOf(prop) > -1 && args[prop] !== undefined) {
      if (prop === 'polygon') {
        a[prop] = parsePolygon(args[prop])
      }
      else a[prop] = args[prop]
    }
  })
  return a
}

function parsePolygon(p) {
  var polygon = []
  for (var i = 0; i < p.length - 1; i+=2 ) {
    polygon.push([p[i],p[i+1]])
  }
  // polygons might have duplicate points ( start, end )
  // better to remove that to prevent errors
  var duplicatePoint = polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1]
  if (duplicatePoint) polygon.splice(-1, 1)
  return polygon
}