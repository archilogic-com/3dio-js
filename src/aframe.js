import Data3dView                   from './aframe/three/data3d-view.js'
import createFileDrop               from './aframe/ui/create-file-drop.js'

// initialize aframe components



var aframe = {
  three: {
    Data3dView: Data3dView,
  },
  ui: {
    createFileDrop: createFileDrop
  }
}

export default aframe