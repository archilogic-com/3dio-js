import checkDependencies from './aframe/check-dependencies.js'
import Data3dView from './aframe/three/data3d-view.js'
import createFileDrop from './aframe/ui/create-file-drop.js'
import data3dComponent from './aframe/component/data3d.js'
import furnitureComponent from './aframe/component/furniture.js'

// initialize aframe components

checkDependencies({
  three: false,
  aFrame: true,
  onError: function (){
    console.log('AFRAME library not found: related features will be disabled.')
  }
}, function registerComponents () {
  AFRAME.registerComponent('3dio-data3d', data3dComponent)
  AFRAME.registerComponent('3dio-furniture', furnitureComponent)
})

// export

var aframe = {
  three: {
    Data3dView: Data3dView,
  },
  ui: {
    createFileDrop: createFileDrop
  }
}

export default aframe