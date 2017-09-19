import runtime from '../../core/runtime.js'
import poll from '../../utils/poll.js'
import getFromStorage from '../../storage/get.js'

var validTypes = [
  'interior',
  'group',
  'level',
  'plan',
  'object'
]

export default function toHtml(sceneStructure, options) {
  if (!sceneStructure) {
    console.error('nothing to convert')
    return
  }
  // check if the request was made by a browser
  runtime.assertBrowser()

  // api
  options = options || {}
  var isArray = Array.isArray(sceneStructure)
  sceneStructure = isArray ? sceneStructure : [sceneStructure]

  // start parsing
  var html = getHtmlFromSceneStructure(sceneStructure)
  return isArray ? html : html[0]
}

// recursive parsing through sceneStructre
function getHtmlFromSceneStructure(sceneStructure, parent) {
  var collection = parent ? null : [] // use collection or parent
  sceneStructure.forEach(function(element3d) {
    if (validTypes.indexOf(element3d.type) > -1) {
      var el = addEntity({
        attributes: getAttributes(element3d),
        parent: parent
      })
      if (element3d.type === 'level' && (element3d.bakeRegularStatusFileKey || element3d.bakePreviewStatusFileKey)) {
        updateOnBake(el, element3d.bakeRegularStatusFileKey || element3d.bakePreviewStatusFileKey)
      }
      if (element3d.children && element3d.children.length) getHtmlFromSceneStructure(element3d.children, el)
      if (collection) collection.push(el)
    }
  })
  return collection
}

// get html attributes from element3d params
function getAttributes(element3d) {
  var attributes = {
    'io3d-uuid': element3d.id,
    position: element3d.x + ' ' + element3d.y + ' ' + element3d.z,
    rotation: '0 ' + element3d.ry + ' 0'
  }

  switch (element3d.type) {
    case 'level':
      attributes['io3d-data3d'] = 'key: ' + element3d.bakedModelUrl
      attributes['shadow'] = 'cast: false, receive: true'
      break
    case 'interior':
      attributes['io3d-furniture'] = 'id: ' + element3d.src.substring(1)
      attributes['shadow'] = 'cast: true, receive: false'
    break
    case 'object':
      attributes['io3d-data3d'] = 'key: ' + element3d.object
      attributes['shadow'] = 'cast: true, receive: true'
    break
  }

  return attributes
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

function updateOnBake(htmlElement, statusFileKey) {
  pollStatusFile(statusFileKey)
    .then(function (bakedModelKey) {
      htmlElement.setAttribute('io3d-data3d', 'key: ' + bakedModelKey)
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