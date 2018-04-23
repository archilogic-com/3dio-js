import cloneDeep from 'lodash/cloneDeep'
import materialLibrary from './material-lib.js'

export default function getMaterials3d (materials, defaults) {
  if (!defaults) {
    console.error('No default materials set')
    defaults={}
  }
  if (!materials) return Promise.resolve(cloneDeep(defaults))
  Object.keys(defaults).forEach(function(d){
    if (!materials[d]) materials[d]=defaults[d]
  })
  Object.keys(materials).map(meshName => {
    if (typeof(materials[meshName])==="string") {
      materials[meshName]=getMaterial(materials[meshName])
    }
  })
  return Promise.resolve(materials)
}

function getMaterial(material) {
  var STORAGE_URL = 'https://storage.3d.io/'
  var mat = materialLibrary[material]

  if (!mat) return material

  var attr = cloneDeep(mat.attributes)
  Object.keys(attr).forEach(a => {
    // get textures
    if (a.indexOf('map') > -1 ) {
      // fix to prevent double slash
      if (attr[a][0] === '/') attr[a] = attr[a].substring(1)
      // get full texture path
      attr[a] = STORAGE_URL + attr[a]
    }
  })
  return attr
}
