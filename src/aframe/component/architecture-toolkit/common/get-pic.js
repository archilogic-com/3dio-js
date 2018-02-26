import cloneDeep from 'lodash/cloneDeep'
import picLibrary from './pic-lib.js'
import configs from '../../../../core/configs'

export default function getMaterial(format, pic) {
  var STORAGE_URL = 'https://storage.3d.io/'
  var mat = picLibrary[format][pic]

  if (!mat) return

  var attr = cloneDeep(mat)
  Object.keys(attr).forEach(a => {
    // get textures with full texture path
    if (a.indexOf('map') > -1 ) attr[a] = convertKeyToUrl(attr[a])
  })
  return attr
}

// helpers
function convertKeyToUrl (key) {
  if (!key) return
  // add leading slash
  if (key[0] !== '/') key = '/'+key
  return 'https://' + configs.storageDomain + key
}