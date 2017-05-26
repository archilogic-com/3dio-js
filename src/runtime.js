import { generateUuid } from './utils/uuid.js'

// rgeistries

var entitites = []
var plugins = []

// constants

var IS_NODE = !!(
  typeof module !== 'undefined'
  && module.exports
  && typeof process !== 'undefined'
  && Object.prototype.toString.call(process) === '[object process]'
  && process.title.indexOf('node') !== -1
)

// entitites

function registerEntity (entity) {
  entitites[entitites.length] = entity
}

function deregisterEntity (entity) {
  var i = entities.indexOf(entity)
  if (i === -1) {
    console.error('Entity with uuid:'+entity.uuid+' not found in runtime registry.')
  } else {
    entitites.splice(i,1)
  }
}

function getEntities () {
  return entitites
}

function getEntityByUuid (uuid) {
  for (var i = 0, l = entitites.length; i < l; i++) {
    if (entitites[i].uuid === uuid) return entitites[i]
  }
  return null
}

// plugins

function registerPlugin (plugin) {
  if (pluginsByName[plugin.name]) {
    console.error('Plugin '+plugin.name+' has been registered already.')
    return false
  } else {
    pluginsByName[plugin.name] = plugin
    // TODO: init plugin on running entitites
    getEntities().forEach(function(entity){
      initPlugin(entity, plugin)
    })
    return true
  }
}

function initPlugin (entity, plugin) {

  // TODO: init plugin here

}

function initPlugins (entity) {
  plugins.forEach(function(plugin){
    initPlugin(entity, plugin)
  })
}

// export public functions

export default {

  sessionId: generateUuid(),

  env: {
    IS_NODE: IS_NODE
  },

  registerEntity: registerEntity,
  deregisterEntity: deregisterEntity,
  getEntityByUuid: getEntityByUuid,
  getEntities: getEntities,

  registerPlugin: registerPlugin,
  initPlugins: initPlugins

}