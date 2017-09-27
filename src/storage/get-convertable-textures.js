import getTextureKeys from '../utils/data3d/get-texture-keys.js'
import loadData3d from '../utils/data3d/load.js'
import getUrlFromStorageId from '../storage/get-url-from-id.js'
import getIdFromUrl from '../storage/get-id-from-url.js'

export default function getConvertableTextures(storageId) {
  var url = getUrlFromStorageId(storageId)
  return loadData3d(url)
    .then(function(data3d) {
      return data3d
    })
    .then(function(data3d) {
      return getTextureKeys(data3d)
    })
    .then(function(textures) {
      return textures.map(getIdFromUrl)
    })
}
