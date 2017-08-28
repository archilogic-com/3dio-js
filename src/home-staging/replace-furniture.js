import getFurnitureInfo  from '../furniture/get-info.js'
import callService  from '../utils/services/call.js'
import normalizeFurnitureInfo from '../furniture/common/normalize-furniture-info.js'

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
    'oval',
    'rectangular',
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
  var rawResult = result.filter(function(el){
    return el.productResourceId !== id
  });
  // if we didn't find anything in the first place
  // let's increase dimensions a bit
  if (rawResult.length < 2) {
    margin += 0.10
    searchCount += 1
    var searchQuery = getQuery(furnitureInfo);
    return search(searchQuery).then(function(result) {
      return verifyResult(result, id)
    })
  } else {
    var cleanResult = rawResult.map(normalizeFurnitureInfo).map(function(res) {
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
  var tags = info.tags.filter(function(tag) {
    // removes blacklisted tags as well as 1P, 2P, ...
    return !config['tag_black_list'].includes(tag) && !/^\d+P$/.test(tag)
  })

  // start removing tags from query when increasing dimensions didn't work
  if (searchCount >= 5) tags = tags.slice(0, (tags.length - searchCount + 5))

  query += ' ' + tags.join(' ')

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
        searchQuery[d + 'Min'] = Math.round((dim[d] - margin) * 1e2) / 1e2
        searchQuery[d + 'Max'] = Math.round((dim[d] + margin) * 1e2) / 1e2
      }
    })
  }
  return searchQuery
}

function computeNewPosition(a, b) {
  var edgeAligned = ['sofa', 'shelf', 'sideboad', 'double bed', 'single bed', 'bed']
  var tags = a.tags
  a = a.boundingPoints
  b = b.boundingPoints
  if (!a || !b) return position

  // check if the furniture's virtual origin should be center or edge
  var isEdgeAligned = edgeAligned.some(function(t) { return tags.includes(t) })

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