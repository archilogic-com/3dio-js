// rgeistries

var instances = []
var plugins = []

// constants

var IS_NODE = !!(
  typeof module !== 'undefined'
  && module.exports
  && typeof process !== 'undefined'
  && Object.prototype.toString.call(process) === '[object process]'
  && process.title.indexOf('node') !== -1
)

// instances

function registerInstance (app) {
  instances[instances.length] = app
}

function deregisterInstance (app) {
  var i = instance.indexOf(app)
  if (i === -1) {
    console.error('Instance with id:'+app.id+' not found in runtime registry.')
  } else {
    instances.splice(i,1)
  }
}

function getInstances () {
  return instances
}

function getInstanceById (id) {
  for (var i = 0, l = instances.length; i < l; i++) {
    if (instances[i].id === id) return instances[i]
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
    // TODO: init plugin on running instances
    getInstances().forEach(function(app){
      initPlugin(app, plugin)
    })
    return true
  }
}

function initPlugin (app, plugin) {

  // TODO: init plugin here

}

function initPlugins (app) {
  plugins.forEach(function(plugin){
    initPlugin(app, plugin)
  })
}

// export public functions

export default {

  env: {
    IS_NODE: IS_NODE
  },

  registerInstance: registerInstance,
  deregisterInstance: deregisterInstance,
  getInstanceById: getInstanceById,
  getInstances: getInstances,

  registerPlugin: registerPlugin,
  initPlugins: initPlugins

}