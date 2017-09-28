import fetchScript from '../utils/io/fetch-script.js'

// internals

var INSPECTOR_PLUGINS_URL = 'https://dist.3d.io/3dio-inspector-plugins/0.x.x/3dio-inspector-plugins.js'

function init() {

  if (window.AFRAME && window.AFRAME.INSPECTOR && window.AFRAME.INSPECTOR.opened) {
    // inspector opened: load immediately
    loadPlugins()
  } else {
    // initialize on inspector ready event
    window.addEventListener('inspector-loaded', loadPlugins)
  }

// methods

  function loadPlugins () {
    if (window.io3d.aFrame.pluginsLoaded) return
    fetchScript(INSPECTOR_PLUGINS_URL).catch(function(error){
      console.error('Could not load inspector plugins: '+error)
    })
  }

}

// expose API

export default {
  init: init
}