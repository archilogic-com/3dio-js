import runtime from '../../core/runtime.js'
import poll from '../../utils/poll.js'
import getFromStorage from '../../storage/get.js'

var validTypes = [
  'interior',
  'group',
  'level',
  'plan',
  'object',
  'camera-bookmark'
]

export default function toAframeElements(sceneStructure, options) {
  if (!sceneStructure) {
    console.error('nothing to convert')
    return
  }
  // check if the request was made by a browser
  runtime.assertBrowser()

  // api
  options = options || {}
  var isArray = Array.isArray(sceneStructure)
  console.log('isArray', isArray)
  sceneStructure = isArray ? sceneStructure : [sceneStructure]

  // start parsing
  var html = getAframeElementsFromSceneStructure(sceneStructure)
  var camHtml = parseCameraBookmarks(sceneStructure, isArray ? html : html[0])
  var result
  if (!camHtml) {
    result = isArray ? html : html[0]
  } else {
    result = (Array.isArray(html) ? html : [html]).concat(camHtml)
  }
  return result
}

// recursive parsing through sceneStructre
function getAframeElementsFromSceneStructure(sceneStructure, parent) {
  var collection = parent ? null : [] // use collection or parent
  sceneStructure.forEach(function(element3d) {
    if (validTypes.indexOf(element3d.type) > -1) {
      var el = addEntity({
        attributes: getAttributes(element3d),
        parent: parent
      })
      if (element3d.type === 'level' && (element3d.bakeRegularStatusFileKey || element3d.bakePreviewStatusFileKey)) {
        updateOnBake(el, element3d)
      } else if(element3d.type === 'camera-bookmark' && element3d.name === 'lastSavePosition') {
        // ?
      }

      if (element3d.children && element3d.children.length) getAframeElementsFromSceneStructure(element3d.children, el)
      if (collection) collection.push(el)
    }
  })

  return collection
}

// get html attributes from element3d params
function getAttributes(element3d) {
  var attributes = {}

  switch (element3d.type) {
    case 'level':
      if (!element3d.bakedModelUrl) {
        console.warn('Level without bakedModelUrl: ', element3d)
        return
      }
      attributes['io3d-data3d'] = 'key: ' + element3d.bakedModelUrl
      if (element3d.lightMapIntensity) {
        attributes['io3d-data3d'] += '; lightMapIntensity: ' + element3d.lightMapIntensity + '; lightMapExposure: ' + element3d.lightMapCenter
      }
      attributes['shadow'] = 'cast: false, receive: true'
      break
    case 'interior':
      attributes['io3d-furniture'] = 'id: ' + element3d.src.substring(1)
      // apply custom material settings for furniture items
      if (element3d.materials && Array.isArray(element3d.materials) ) {
        element3d.materials.forEach(function(mat) {
          if (mat.mesh && mat.material) attributes['io3d-furniture'] += '; material_' + mat.mesh.replace(/\s/g, '_') + ':' + mat.material
        })
      }
      attributes['shadow'] = 'cast: true, receive: false'
    break
    case 'object':
      attributes['io3d-data3d'] = 'key: ' + element3d.object
      attributes['shadow'] = 'cast: true, receive: true'
    break
  }

  attributes.position = element3d.x + ' ' + element3d.y + ' ' + element3d.z
  attributes.rotation = (element3d.rx || 0) + ' ' + element3d.ry + ' 0'
  attributes['io3d-uuid'] = element3d.id

  return attributes
}

// creates a camera and tour-waypoints from scene structure
function parseCameraBookmarks(sceneStructure, planRoot) {
  var bookmarks = flattenSceneStructure(sceneStructure[0]).filter(function (element) { return element.type === 'camera-bookmark' })
  console.log('bookmarks', bookmarks)
  if (bookmarks.length === 0) return

  var lastSavePosition = bookmarks.find(function (element) { return element.name === 'lastSavePosition' })
  var camPosition = { x: 0, y: 1.6, z: 0 }
  var camRotation = { x: 0, y: 0, z: 0 }

  if (lastSavePosition) {
    if (lastSavePosition.mode === 'bird') {
      lastSavePosition.y += lastSavePosition.distance
    }
    //camPosition = { x: lastSavePosition.x, y: lastSavePosition.y, z: lastSavePosition.z }
    //camRotation = { x: lastSavePosition.rx, y: lastSavePosition.ry, z: 0 }
  }

  console.log('parent', planRoot, planRoot.getAttribute('position'), planRoot.getAttribute('rotation'))

  var camera = addEntity({
    attributes: {
      camera: '',
      tour: { autoStart: false },
      'wasd-controls': '',
      'look-controls': '',
      position: camPosition,
      rotation: camRotation
    }
  })

  bookmarks
    .filter(function (element) { return element.name !== 'lastSavePosition' })
    .forEach(function (element) {
      var position = { x: element.x, y: element.y, z: element.z }
      // correct position based on parents
      /*
      if(element.parent) {
        (function localToWorld(el) {
          position.x -= el.x
          position.y -= el.y
          position.z -= el.z
          if(el.parent) localToWorld(el.parent)
        })(element.parent)
      }*/
      var ry = element.ry
      var rp = element.rx * Math.PI / 180
      var cosRp = Math.cos(rp)
      var x = element.x, y = element.y, z = element.z, d = element.distance

      position = {
        x: -Math.sin(ry * cosRp * d + x),
        y: -Math.sin(rp) * d + y,
        z: -Math.cos(ry) * cosRp * d + z
      }
      // OH GOD...
      /*
      I got:
        ry, pivotX, pivotY, pivotZ, d
      I need:
        rp, cosRp, do "lookAt"
      */

/*
        this.threeCamera.position.set(
          -Math.sin(ry) * cosRp * d + a.pivotX,
          -Math.sin(rp) * d + a.pivotY,
          -Math.cos(ry) * cosRp * d + a.pivotZ
        )
*/

      if (element.mode === 'bird' || element.mode === 'floorplan') position.y = Math.max(element.distance - 5, 8)
      addEntity({
        parent: camera,
        attributes: {
          'tour-waypoint': element.name,
          position: position,
          rotation: { x: element.rx, y: element.ry, z: 0 }
        }
      })
    })

  return camera
}


function addEntity(args) {
  var
    tag = args.tag || 'a-entity',
    parent = args.parent,
    attributes = args.attributes || {}

  var el = document.createElement(tag)

  Object.keys(attributes).forEach(function(key) {
    el.setAttribute(key, attributes[key])
  })

  if (parent) return parent.appendChild(el)
  else return el
}

function updateOnBake(htmlElement, element3d) {
  var statusFileKey = element3d.bakeRegularStatusFileKey || element3d.bakePreviewStatusFileKey

  pollStatusFile(statusFileKey)
    .then(function (bakedModelKey) {
      var attribValue = 'key: ' + bakedModelKey
      if (element3d.lightMapIntensity) {
        attribValue += '; lightMapIntensity: ' + element3d.lightMapIntensity + '; lightMapExposure: ' + element3d.lightMapCenter
      }

      htmlElement.setAttribute('io3d-data3d', attribValue)
    })
}

// TODO: Migrate that to a shared helper

function pollStatusFile(fileKey) {
  return poll(function onPoll(onSuccess, onError, next) {
    /*
    1. Read status file content
    2. Check if we're done -> call onSuccess
       Check if it failed  -> call onError
       Otherwise call next
     */
    getFromStorage(fileKey, { type: "json", cdn: false }).then(function checkContent(content) {
      if (content && content.params) {
        switch (content.params.status) {
          case 'SUCCESS':
            onSuccess(content.params.data)
            break
          case 'PROCESSING':
          case 'ENQUEUED':
            next()
            break
          default:
            onError(content.params.data)
        }
      }
    })
  })
}

function flattenSceneStructure(sceneStructure, parent) {
  var result = []
  sceneStructure.parent = parent
  result.push(sceneStructure)
  if(sceneStructure.children) {
    sceneStructure.children.forEach(function (child) {
      result = result.concat(flattenSceneStructure(child, sceneStructure))
    })
  }
  return result
}

function deg2rad(x) { return x * (Math.PI / 180) }
function rad2deg(x) { return x * (180 / Math.PI) }
