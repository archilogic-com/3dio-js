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

    var cameraEL = document.querySelector('a-entity[camera]') || document.querySelector('a-camera')
    if (!cameraEL) {
      console.warn('this scene has no camera, add one to make the lighting work')
    }
    this.cam = cameraEL.object3D

    // main
    this.staticLights = document.createElement('a-entity')
    this.staticLights.id = 'static-lights'
    this.movingWithCamera = document.createElement('a-entity')
    this.movingWithCamera.id = 'moving-lights'
    this.rotatingWithCamera = document.createElement('a-entity')
    this.rotatingWithCamera.id = 'rotating-lights'
    this.el.appendChild(this.staticLights)
    this.el.appendChild(this.movingWithCamera)
    this.el.appendChild(this.rotatingWithCamera)
  },

  update: function () {

    this.remove()

    createLighting[this.data.preset](
      this.movingWithCamera,
      this.rotatingWithCamera,
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
    this.rotatingWithCamera.setAttribute('rotation', AFRAME.utils.coordinates.stringify(lightRotation))
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

var createLighting = {
  studio: function(movingWithCamera, rotatingWithCamera, staticLights, intensity, saturation) {

    // target for moving directional lights
    addElement({
      'id': 'light-target',
      'position': {x: 0, y: 0, z:-2}
    }, movingWithCamera)

    // shadow casting top down light
    addElement({
      'light': {
        type: 'directional',
        color: '#333',
        intensity: 1,
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
      },
      'position': {x: 0, y: 10, z:-2},
      'id': 'shadow-light'
    }, movingWithCamera)

    // hemisphere light for yellow - blue tint
    addElement({
      'light': {
        type: 'hemisphere',
        // yellow
        color: 'hsl(35, ' + 15 * saturation + '%, 60%)',
        // blue
        groundColor: 'hsl(220, ' + 10 * saturation + '%, 65%)',
        intensity: 0.4 * intensity
      },
      // positioning left equals rotation by 90°
      'position': {x: -2, y: 0, z:0},
      'rotation': {x: 0, y: 45, z:0},
      'id': 'hemisphere-color'
      }, rotatingWithCamera)

    // hemisphere light for brightness from front
    addElement({
      'light': {
        type: 'hemisphere',
        color: 'hsl(0, 0%, 0%)',
        groundColor: 'hsl(0, 0%, 80%)',
        intensity: 0.3 * intensity
      },
      // positioning front equals rotation by 90°
      'position': {x: 0, y: 1, z:0},
      'id': 'hemisphere-white'
    }, rotatingWithCamera)

    // lights for specular
    // blue
    addElement({
      'light': {
        type: 'directional',
        color: 'hsl(200, ' + 10 * saturation + '%, 60%)',
        intensity: 0.25 * intensity,
        // target: '#light-target'
      },
      'position': {x: 2, y: 2, z:-1},
      'id': 'specular-blue'
    }, rotatingWithCamera)

    // yellow
    addElement({
      'light': {
        type: 'directional',
        color: 'hsl(35, ' + 10 * saturation + '%, 60%)',
        intensity: 0.35 * intensity,
        // target: '#light-target'
      },
      'position': {x: -2, y: 1, z:2},
      'id': 'specular-yellow'
    }, rotatingWithCamera)

    // overall ambient light
    addElement({
      'light': {
        type: 'ambient',
        color: '#FFF',
        intensity: 0.5
      },
      'id': 'ambient-light'
    }, staticLights)
  }
}

function addElement(attributes, parent) {
  var el = document.createElement('a-entity')
  Object.keys(attributes).forEach(function(key) {
    el.setAttribute(key, attributes[key])
  })
  parent.appendChild(el)
}