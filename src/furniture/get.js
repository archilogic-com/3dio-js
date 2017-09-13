import getFurnitureInfo  from './get-info.js'
import loadData3d from '../utils/data3d/load.js'

export default function getFurniture (id) {
  // we need to call furniture info first in order to obtain data3d URL
  return getFurnitureInfo(id).then(function(info){
    return loadData3d(info.data3dUrl, { loadingQueuePrefix: 'interior' }).then(function(data3d){
      return {
        // contains lightweight metadata like designer name and description
        info: info,
        // contains geometry and material definitions
        data3d: data3d
      }
    })
  })
}