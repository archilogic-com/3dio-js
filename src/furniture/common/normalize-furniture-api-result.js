export default function normalizeFurnitureResult (rawItem) {
  // normalizes furniture definitions from server side endpoints
  return {
    // main info
    id: rawItem.productResourceId,
    name: rawItem.productDisplayName,
    description: rawItem.description,
    manufacturer: rawItem.manufacturer,
    designer: rawItem.designer,
    indexImage: convertKeyToUrl(rawItem.preview),
    images: rawItem.images.map(convertKeyToUrl),
    url: rawItem.link,
    year: rawItem.year,
    // grouping
    collectionIds: rawItem.productCollectionResourceIds,
    tags: cleanUpArrays(rawItem.tags),
    styles: cleanUpArrays(rawItem.styles),
    categories: cleanUpArrays(rawItem.categories),
    colours: cleanUpArrays(rawItem.colours),
    // geometry
    boundingBox: rawItem.boundingBox,
    boundingPoints: rawItem.boundingPoints,
    // data info
    created: rawItem.createdAt,
    updated: rawItem.updatedAt
  }
}

// helpers

function convertKeyToUrl (key) {
  // add leading slash
  if (key[0] !== '/') key = '/'+key
  return 'https://storage.3d.io' + key
}

function cleanUpArrays (arr) {
  return arr[0] === '' ? arr.slice(1) : arr
}