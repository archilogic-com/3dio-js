export default {

  schema: {
    preset: {
      type: 'string',
      default: 'studio'
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
    this.staticLights = document.createElement('a-entity')
    this.staticLights.id = 'static-lights'
    this.movingWithCamera = document.createElement('a-entity')
    this.movingWithCamera.id = 'moving-lights'
    this.el.appendChild(this.staticLights)
    this.el.appendChild(this.movingWithCamera)
  },

  update: function () {

    this.remove()

    createLighting(
      this.data.preset,
      this.movingWithCamera,
      this.staticLights,
      this.data.intensity,
      this.data.saturation
    )

  },

  remove: function () {
    // clear previous light setup
    while (this.movingWithCamera.hasChildNodes()) {
      this.movingWithCamera.removeChild(this.movingWithCamera.lastChild);
    }
    while (this.staticLights.hasChildNodes()) {
      this.staticLights.removeChild(this.staticLights.lastChild);
    }
  },

  tick: function (dt) {
    // set position from camera
    this.movingWithCamera.setAttribute('position', this.cam.position)
    // set y rotation - convert rad to deg
    var lightRotation = {x: 0, y: this.cam.rotation.y * 180 / Math.PI, z: 0}
    this.movingWithCamera.setAttribute('rotation', AFRAME.utils.coordinates.stringify(lightRotation))
  }

}

// configs

var SHADOW_CAMERA_NEAR = 1
var SHADOW_CAMERA_FAR = 60
var SHADOW_SIZE = 20 // real size of shadow map in meters
var SHADOW_MAP_SIZE = 1024 // pixel size of shadow map
var SHADOW_BIAS = 0.001
// var SHADOW_DARKNESS = 0.2

// light presets

var lightPresets = {
  studio: function() {
    return { }
  },
  morning: function() {
    return {
      COLOR_AMBIENT: '#d0ac89',
      INT_LEFT: 0.75
    }
  },
  night: function() {
    return {
      COLOR_AMBIENT: '#646d80',
      INT_RIGHT: 0.35,
      INT_LEFT: 0.35,
      INT_AMBIENT: 0.50
    }
  }
}

var createLighting = function(preset, movingWithCamera, staticLights, intensity, saturation) {

  preset = lightPresets[preset](saturation)

  var COLOR_AMBIENT = preset.COLOR_AMBIENT || '#fffcfa'
  var COLOR_RIGHT = preset.COLOR_RIGHT || 'hsl(190, ' + 30 * saturation + '%, 60%)'
  var COLOR_LEFT = preset.COLOR_LEFT || 'hsl(24, ' + 30 * saturation + '%, 60%)'
  var COLOR_FRONT = preset.COLOR_FRONT || 'hsl(25, ' + 20 * saturation + '%, 95%)'

  var INT_SHADOW = preset.INT_SHADOW || 0.15
  var INT_RIGHT = preset.INT_RIGHT || 0.25
  var INT_LEFT = preset.INT_LEFT || 0.25
  var INT_FRONT = preset.INT_FRONT || 0.18
  var INT_AMBIENT = preset.INT_AMBIENT || 0.78

  var POS_RIGHT = preset.POS_RIGHT || {x: 10, y: 4, z:-2}
  var POS_LEFT = preset.POS_LEFT || {x: -10, y: 4, z:-2}
  var POS_FRONT = preset.POS_FRONT || {x:0, y: 2, z:10}
  var POS_SHADOW = preset.POS_SHADOW || {x: 0, y: 10, z:-2}
  var POS_TARGET = preset.POS_TARGET || {x: 0, y: 0, z:-2}

  var shadowLight = document.createElement('a-entity')
  shadowLight.id = 'shadow-light'
  shadowLight.setAttribute('light', {
    type: 'directional',
    color: COLOR_AMBIENT,
    intensity: INT_SHADOW,
    target: '#light-target',
    castShadow: true,
    shadowCameraLeft: -SHADOW_SIZE / 2,
    shadowCameraRight: SHADOW_SIZE / 2,
    shadowCameraBottom: -SHADOW_SIZE / 2,
    shadowCameraTop: SHADOW_SIZE / 2,
    shadowMapHeight: SHADOW_MAP_SIZE,
    shadowMapWidth: SHADOW_MAP_SIZE,
    shadowBias: SHADOW_BIAS,
    shadowCameraNear: SHADOW_CAMERA_NEAR,
    shadowCameraFar: SHADOW_CAMERA_FAR
  })
  shadowLight.setAttribute('position', POS_SHADOW)

  var leftLight = document.createElement('a-entity')
  leftLight.setAttribute('light', {type: 'directional', color: COLOR_LEFT, intensity: INT_LEFT * intensity, target: '#light-target'})
  leftLight.setAttribute('position', POS_LEFT)
  var rightLight = document.createElement('a-entity')
  rightLight.setAttribute('light', {type: 'directional', color: COLOR_RIGHT, intensity: INT_RIGHT * intensity, target: '#light-target'})
  rightLight.setAttribute('position', POS_RIGHT)
  var frontLight = document.createElement('a-entity')
  frontLight.setAttribute('light', {type: 'directional', color: COLOR_FRONT, intensity: INT_FRONT * intensity, target: '#light-target'})
  frontLight.setAttribute('position', POS_FRONT)

  var target = document.createElement('a-entity')
  target.id = 'light-target'
  target.setAttribute('position', POS_TARGET)

  movingWithCamera.appendChild(target)
  movingWithCamera.appendChild(shadowLight)
  movingWithCamera.appendChild(leftLight)
  movingWithCamera.appendChild(rightLight)
  movingWithCamera.appendChild(frontLight)

  var ambientLight = document.createElement('a-entity')
  ambientLight.setAttribute('light', {type: 'ambient', color: COLOR_AMBIENT, intensity: INT_AMBIENT})

  staticLights.appendChild(ambientLight)
}