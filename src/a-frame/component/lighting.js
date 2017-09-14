export default {

  schema: {
    preset: {
      type: 'string',
      default: 'malibu'
    },
    intensity: {
      type: 'float',
      default: 1
    },
    saturation: {
      type: 'float',
      default: 1
    }
  },

  init: function () {

    this.cam = document.querySelector('a-entity[camera]').object3D

    // main
    var lighting = new THREE.Object3D()
    this.el.setObject3D('lighting', lighting)

    // lights moving with camera
    this.movingWithCamera = new THREE.Object3D()
    lighting.add(this.movingWithCamera)

    // static lights
    this.static = new THREE.Object3D()
    lighting.add(this.static)

  },

  update: function () {

    this.remove()

    createPreset[this.data.preset](
      this.movingWithCamera,
      this.static,
      this.data.intensity,
      this.data.saturation
    )

  },

  remove: function () {

    this.movingWithCamera.children.forEach(function (child) {
      child.parent.remove(child)
    })

    this.static.children.forEach(function (child) {
      child.parent.remove(child)
    })

  },

  tick: function (dt) {

    this.movingWithCamera.position.copy(this.cam.position)
    this.movingWithCamera.rotation.copy(this.cam.rotation)

  }

}

// configs

var SHADOW_CAMERA_NEAR = 1
var SHADOW_CAMERA_FAR = 60
var SHADOW_SIZE = 40 // real size of shadow map in meters
var SHADOW_MAP_SIZE = 1024 // pixel size of shadow map
var SHADOW_BIAS = 0.001
var SHADOW_DARKNESS = 0.2

// light presets

var createPreset = {
  malibu: function(movingWithCamera, staticLights, intensity, saturation) {

    var target = new THREE.Object3D()
    movingWithCamera.add(target)

    // spec: left (orange) / right (blue)

    var leftColor = new THREE.Color().setHSL(0.095, 0.5, 0.6) // orange
    var rightColor = new THREE.Color().setHSL(0.6, 0.4, 0.6) // blue
    var leftRightSpec = new THREE.HemisphereLight(leftColor, rightColor, 0.6 * intensity)
    leftRightSpec.position.set(-500, 200, 200)
    leftRightSpec.target = target
    movingWithCamera.add(leftRightSpec)

    // fspec: front / back

    var frontColor = new THREE.Color().setHSL(0, 0, 0.3)
    var backColor = new THREE.Color().setHSL(0, 0, 0.8)
    var frontBackSpec = new THREE.HemisphereLight(frontColor, backColor, 0.5 * intensity)
    frontBackSpec.position.set(0, 100, -10000)
    frontBackSpec.target = target
    movingWithCamera.add(frontBackSpec)

    // ambient

    var ambientColor = new THREE.Color().setHSL(0,0,0.3 * intensity)
    var ambient = new THREE.AmbientLight(ambientColor)
    staticLights.add(ambient)

    // sun & shadow

    var sunTarget = new THREE.Object3D()
    staticLights.add(sunTarget)

    var sunColor = new THREE.Color().setHSL(0,0,1)
    var sun = new THREE.DirectionalLight(sunColor, 0 * intensity)
    sun.position.set(100, 100, 0)
    sun.target = sunTarget
    sun.shadow.camera.visible = false // helper
    sun.castShadow = true
    sun.shadowMapEnabled = true
    sun.shadow.bias = SHADOW_BIAS
    sun.shadow.darkness = SHADOW_DARKNESS
    sun.shadow.mapSize.width = sun.shadow.mapSize.height = SHADOW_MAP_SIZE
    sun.shadow.camera.near = SHADOW_CAMERA_NEAR
    sun.shadow.camera.Far = SHADOW_CAMERA_FAR
    sun.shadow.camera.right = sun.shadow.camera.top = SHADOW_SIZE / 2
    sun.shadow.camera.left = sun.shadow.camera.bottom = -SHADOW_SIZE / 2
    staticLights.add(sun)

  }
}