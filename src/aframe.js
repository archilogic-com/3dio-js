import runtime from './core/runtime.js'
import checkDependencies from './aframe/check-dependencies.js'
// components
import data3dComponent from './aframe/component/data3d.js'
import furnitureComponent from './aframe/component/furniture.js'
import tourComponent from './aframe/component/tour.js'
import gBlockComponent from './aframe/component/gblock.js'
import lightingComponent from './aframe/component/lighting.js'
import minimapComponent from './aframe/component/minimap.js'
// architectural tookit
import closetComponent from './aframe/component/architectural-toolkit/closet.js'
import columnComponent from './aframe/component/architectural-toolkit/column.js'
import doorComponent from './aframe/component/architectural-toolkit/door.js'
import floorComponent from './aframe/component/architectural-toolkit/floor.js'
import kitchenComponent from './aframe/component/architectural-toolkit/kitchen.js'
import polyFloorComponent from './aframe/component/architectural-toolkit/polyfloor.js'
import railingComponent from './aframe/component/architectural-toolkit/railing.js'
import stairsComponent from './aframe/component/architectural-toolkit/stairs.js'
import wallComponent from './aframe/component/architectural-toolkit/wall.js'
import windowComponent from './aframe/component/architectural-toolkit/window.js'
// other
import inspectorPluginsLauncher from './aframe/inspector-plugins-launcher.js'
import Data3dView from './aframe/three/data3d-view.js'

// dependency check (for node.js compatibility)

checkDependencies({
  three: false,
  aframe: true,
  onError: function (){
    // show aframe dependency warning, since it is unexpected to run aframe on server
    if (runtime.isBrowser) console.warn('AFRAME library not found: related features will be disabled.')
  }
}, function registerComponents () {

  // register components
  AFRAME.registerComponent('io3d-data3d', data3dComponent)
  AFRAME.registerComponent('io3d-furniture', furnitureComponent)
  AFRAME.registerComponent('tour', tourComponent)
  AFRAME.registerComponent('io3d-lighting', lightingComponent)
  AFRAME.registerComponent('io3d-minimap', minimapComponent)
  // architectural tookit
  AFRAME.registerComponent('io3d-closet', closetComponent)
  AFRAME.registerComponent('io3d-column', columnComponent)
  AFRAME.registerComponent('io3d-door', doorComponent)
  AFRAME.registerComponent('io3d-floor', floorComponent)
  AFRAME.registerComponent('io3d-kitchen', kitchenComponent)
  AFRAME.registerComponent('io3d-polyfloor', polyFloorComponent)
  AFRAME.registerComponent('io3d-railing', railingComponent)
  AFRAME.registerComponent('io3d-stairs', stairsComponent)
  AFRAME.registerComponent('io3d-wall', wallComponent)
  AFRAME.registerComponent('io3d-window', windowComponent)
  // check if gblock component has already been registered
  if (AFRAME.components.gblock) {
    // legacy warning in case gblock has been registered using https://github.com/archilogic-com/aframe-gblock/
    console.error('3dio.js error: Please remove any other "<script>" tags registering the "gblock" A-Frame component. This component is included in 3dio.js')
  } else {
    AFRAME.registerComponent('gblock', gBlockComponent)
  }


  // init plugin launcher

  inspectorPluginsLauncher.init()

})

// export

var aframe = {
  three: {
    Data3dView: Data3dView
  }
}

export default aframe