export default function normalizeFurnitureInfo (rawInfo) {
  // normalizes furniture definitions from server side endpoints
  return {
    // main info
    id: rawInfo.productResourceId,
    name: rawInfo.productDisplayName,
    description: rawInfo.description,
    manufacturer: rawInfo.manufacturer,
    designer: rawInfo.designer,
    indexImage: convertKeyToUrl(rawInfo.preview),
    images: rawInfo.images.map(convertKeyToUrl),
    url: rawInfo.link,
    year: rawInfo.year,
    // grouping
    collectionIds: rawInfo.productCollectionResourceIds,
    tags: cleanUpArrays(rawInfo.tags),
    styles: cleanUpArrays(rawInfo.styles),
    categories: cleanUpArrays(rawInfo.categories),
    colors: cleanUpArrays(rawInfo.colours),
    // geometry
    boundingBox: rawInfo.boundingBox,
    boundingPoints: rawInfo.boundingPoints,
    data3dUrl: convertKeyToUrl(rawInfo.fileKey),
    // data info
    created: rawInfo.createdAt,
    updated: rawInfo.updatedAt
  }
}

// helpers

function convertKeyToUrl (key) {
  // add leading slash
  if (key[0] !== '/') key = '/'+key
  return 'https://storage.3d.io' + key
}

function cleanUpArrays (arr) {
  // TODO: remove this once #252 is resolved https://github.com/archilogic-com/services/issues/252
  return arr[0] === '' ? arr.slice(1) : arr
}