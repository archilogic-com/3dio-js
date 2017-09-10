import getFurnitureInfo  from '../furniture/get-info.js'
import callService  from '../utils/services/call.js'
import normalizeFurnitureInfo from '../furniture/common/normalize-furniture-info.js'

var config = {
  'default_margin': 0.1,
  'default_search': 'isPublished:true -generic',
  'tag_black_list': [
    'simplygon',
    'hasChangeableMaterials',
    'autofurnish',
    'wallAttached',
    '2 seater',
    '3 seater',
    '4 seater'
  ],
  'edgeAligned': ['sofa', 'shelf', 'sideboad', 'double bed', 'single bed', 'bed']
}

export default function getAlternatives(id, options) {
  console.log('get alternatives for', id)
  if (typeof id !== 'string') return Promise.reject('invalid input')

  options = options || {}
  var data = {
    userQuery: options.query || null,
    searchCount: 0,
    margin: config['default_margin'],
    furnitureInfo: null
  }

  return getFurnitureInfo(id)
    .then(function(info){
      data.furnitureInfo = info
      //margin = config['default_margin']
      //searchCount = 0
      var searchQuery = getQuery(data)
      return search(searchQuery)
    })
    .then(function(result) {
      return verifyResult(result, id, data)
    })
    .catch(function(error) {
      console.error(error)
    })
}

function verifyResult(result, id, data) {
  if (data.searchCount > 10 ) {
    return Promise.reject(new Error('No furniture was found'))
  }
  var rawResult = result.filter(function(el){
    return el.productResourceId !== id
  });
  // if we didn't find anything in the first place
  // let's increase dimensions a bit
  if (rawResult.length < 2) {
    if (data.searchCount >= 3) data.margin += 0.10
    var searchQuery = getQuery(data);
    data.searchCount += 1
    return search(searchQuery)
      .then(function(result) {
        return verifyResult(result, id, data)
      })
      .catch(function(error) {
        console.error(error)
      })
  } else {
    var cleanResult = rawResult.map(normalizeFurnitureInfo).map(function(res) {
      return {
        furniture: res,
        offset: getOffset(data.furnitureInfo, res)
      }
    })
    return Promise.resolve(cleanResult)
  }
}

function search(searchQuery) {
  // let's make sure we don't have trailing or double spaces
  searchQuery.query = searchQuery.query.trim().replace(/\s+/g, ' ')
  console.log(searchQuery.query)
  return callService('Product.search', {searchQuery: searchQuery, limit: 200})
}

function getQuery(data) {
  var query = config['default_search']
  var tags = data.furnitureInfo.tags.filter(function(tag) {
    // removes blacklisted tags as well as 1P, 2P, ...
    return !config['tag_black_list'].includes(tag) && !/^\d+P$/.test(tag)
  })

  // start removing tags from query when increasing dimensions didn't work
  if (data.searchCount > 1) tags = tags.slice(0, (tags.length - data.searchCount + 1))

  query += ' ' + tags.join(' ')

  var categories = data.furnitureInfo.categories
  var dim = data.furnitureInfo.boundingBox

  query += ' categories:' + categories[0]
  if (data.userQuery) query += ' ' + data.userQuery

  var searchQuery = {query: query};
  // add dimension search params if source provides dimensions
  if (dim) {
    ['length', 'height', 'width'].forEach(function(d) {
      if (dim[d] -data.margin > 0) {
        searchQuery[d + 'Min'] = Math.round((dim[d] - data.margin) * 1e2) / 1e2
        searchQuery[d + 'Max'] = Math.round((dim[d] + data.margin) * 1e2) / 1e2
      }
    })
  }
  return searchQuery
}

// get offset based on bounding boxes
function getOffset(a, b) {
  // for elements that are aligned at the wall we want to compute the offset accordingly
  var edgeAligned = config.edgeAligned

  var tags = a.tags
  a = a.boundingPoints
  b = b.boundingPoints
  if (!a || !b) return {x: 0, y:0, z:0}

  // check if the furniture's virtual origin should be center or edge
  var isEdgeAligned = edgeAligned.some(function(t) { return tags.includes(t) })

  var zOffset
  // compute offset between edges or centers
  if (isEdgeAligned) zOffset = a.min[2] - b.min[2]
  else zOffset = (a.max[2] + a.min[2]) / 2 - (b.max[2] + b.min[2]) / 2

  var offset = {
    // compute offset between centers
    x: (a.max[0] + a.min[0]) / 2 - (b.max[0] + b.min[0]) / 2,
    y: 0,
    z: zOffset
  }
  return offset
}