import put from './storage/put.js'
import get from './storage/get.js'
import getUrlFromStorageId from './storage/get-url-from-id.js'
import getNoCdnUrlFromStorageId from './storage/get-no-cdn-url-from-id.js'
import getStorageIdFromUrl from './storage/get-id-from-url.js'
import importThreeObject from './storage/import-three-object.js'
import importAframeElement from './storage/import-aframe-element.js'
import modelExporter from './storage/model-exporter.js'

var storage = {
  // low level
  get: get,
  put: put,
  // import
  importThreeObject: importThreeObject,
  importAframeElement: importAframeElement,
  // export
  export3ds: modelExporter.export3ds,
  exportBlend: modelExporter.exportBlend,
  exportDae: modelExporter.exportDae,
  exportFbx: modelExporter.exportFbx,
  exportObj: modelExporter.exportObj,
  exportDxf: modelExporter.exportDxf,
  // helpers
  getUrlFromStorageId: getUrlFromStorageId,
  getUrlFromId: getUrlFromStorageId, // alias
  getNoCdnUrlFromStorageId: getNoCdnUrlFromStorageId,
  getNoCdnUrlFromId: getNoCdnUrlFromStorageId, // alias
  getStorageIdFromUrl: getStorageIdFromUrl,
  getIdFromUrl: getStorageIdFromUrl // alias
}

export default storage
