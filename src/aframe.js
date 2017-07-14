import Data3dView from './aframe/three/data3d-view.js'
import createFileDrop from './aframe/ui/create-file-drop.js'
import data3dComponent from './aframe/component/data3d.js'
import furnitureComponent from './aframe/component/furniture.js'

// initialize aframe components

if (typeof window !== 'undefined' && window.AFRAME) registerComponents()

// helpers

function registerComponents () {
  if (typeof window === 'undefined' || !window.AFRAME) {
    console.error('AFRAME not found')
    return
  }
  AFRAME.registerComponent('3dio-data3d', data3dComponent)
  AFRAME.registerComponent('3dio-furniture', furnitureComponent)
}

// export

var aframe = {
  registerComponents: registerComponents,
  three: {
    Data3dView: Data3dView,
  },
  ui: {
    createFileDrop: createFileDrop
  }
}

export default aframe