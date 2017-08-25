import getFurnitureInfo  from '../furniture/get-info.js'
import callService  from '../utils/services/call.js'

var userQuery, searchCount, margin, furnitureInfo, position, rotation

var config = {
  'default_margin': 0.1,
  'default_search': '-generic isPublished:true',
  'tag_black_list': [
    'simplygon',
    'hasChangeableMaterials',
    'autofurnish',
    'wallAttached',
    'daybed',
    '2 seater',
    '3 seater',
    '4 seater'
  ],
}

export default function replaceFurniture (id, options) {
  // API
  options = options || {}
  userQuery = options.query || null
  position = options.position || {x: 0, y: 0, z: 0}
  rotation = options.rotation || {x: 0, y: 0, z: 0}
  // config publishable api key
  // reject when no publishable or not white listed domain
  // we need to call furniture info first in order to obtain data3d URL
  return getFurnitureInfo(id)
    .then(function(info){
      furnitureInfo = info
      margin = config['default_margin']
      searchCount = 0
      var searchQuery = getQuery(furnitureInfo)
      return search(searchQuery)
    })
    .then(function(result) {
      return verifyResult(result, id)
    })
    .catch(function(error) {
      console.error(error.message)
    })
}

function verifyResult(result, id) {
  if (searchCount > 10 ) {
    return Promise.reject(new Error('No furniture was found'))
  }
  var cleanResult = result.filter(function(el){
    return el.productResourceId !== id
  });

  if (cleanResult.length < 2) {
    margin += 0.10
    searchCount += 1
    var searchQuery = getQuery(furnitureInfo);
    return search(searchQuery).then(function(result) {
      return verifyResult(result, id)
    })
  } else {
    cleanResult = cleanResult.map(function(res) {
      return {
        furniture: res,
        position: computeNewPosition(furnitureInfo, res)
      }
    })
    return Promise.resolve(cleanResult)
  }
}

function search(searchQuery) {
  return callService('Product.search', {searchQuery: searchQuery, limit: 200})
}

function getQuery(info) {
  var query = config['default_search']
  var tags = info.tags

  tags.forEach(function(tag) {
    // filter out black listed tags
    if (config['tag_black_list'].indexOf(tag) < 0 ) {
      // filter out 1P, 2P ... tags
      if (!/^\d+P$/.test(tag)) query += ' ' + tag
    }
  })

  var categories = info.categories
  var dim = info.boundingBox

  query += ' categories:' + categories[0]
  if (userQuery) query += ' ' + userQuery

  query = query.trim()
  var searchQuery = {query: query};
  // add dimension search params if source provides dimensions
  if (dim) {
    ['length', 'height', 'width'].forEach(function(d) {
      if (dim[d] -margin > 0) {
        searchQuery[d + 'Min'] = Math.round((dim[d] - margin) * 100) / 100
        searchQuery[d + 'Max'] = Math.round((dim[d] + margin) * 100) / 100
      }
    })
  }
  return searchQuery
}

function computeNewPosition(a, b) {
  var edgeAligned = ['sofa', 'shelf', 'sideboad', 'double bed', 'single bed', 'bed']
  var isEdgeAligned = false
  var tags = a.tags
  a = a.boundingPoints
  b = b.boundingPoints
  if (!a || !b) return position

  edgeAligned.forEach(function(t) {
    if (tags.indexOf(t) > -1) isEdgeAligned = true
  })

  var offset = {
    // compute offset between centers
    x: (a.max[0] + a.min[0]) / 2 - (b.max[0] + b.min[0]) / 2,
    y: 0,
    // compute offset between edges or centers
    z: isEdgeAligned ? a.min[2] - b.min[2] : (a.max[2] + a.min[2]) / 2 - (b.max[2] + b.min[2]) / 2
  }

  var s = Math.sin(rotation.y / 180 * Math.PI)
  var c = Math.cos(rotation.y / 180 * Math.PI)
  var newPosition = {
    x: position.x + offset.x * c + offset.z * s,
    y: position.y + offset.y,
    z: position.z - offset.x * s + offset.z * c
  }
  return newPosition
}