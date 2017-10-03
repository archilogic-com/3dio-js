import getUrlFromStorageId from '../../storage/get-url-from-id.js'
import getStorageIdFromUrl from '../../storage/get-id-from-url.js'
import getTextureKeys from '../data3d/get-texture-keys.js'
import loadData3d from '../data3d/load.js'

export default function getConvertableTextureKeys(storageId) {

  var url = getUrlFromStorageId(storageId)

  return loadData3d(url)
    .then(getTextureKeys)
    .then(function(textures) {
      return textures.map(getStorageIdFromUrl)
    })

}
