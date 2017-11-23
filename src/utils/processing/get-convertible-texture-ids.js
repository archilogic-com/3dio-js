import getUrlFromStorageId from '../../storage/get-url-from-id.js'
import getStorageIdFromUrl from '../../storage/get-id-from-url.js'
import getTextureKeys from '../data3d/get-texture-keys.js'
import loadData3d from '../data3d/load.js'

export default function getConvertibleTextureKeys(storageId) {

  var url = getUrlFromStorageId(storageId)

  return loadData3d(url)
    .then(function(data3d) {

      return getTextureKeys(data3d, {
        filter: function (storageId, type, format, material, data3d) {
          // use source maps only
          return format === 'source' ? storageId : false
        }
      })

    })
    .then(function(textures) {
      return textures.map(getStorageIdFromUrl)
    })

}
