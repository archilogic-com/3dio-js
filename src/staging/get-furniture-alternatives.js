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
  'tag_white_list': [
    'shelf',
    'armchair',
    'sofa',
    'plant',
    'sideboard',
    'coffee table',
    'dining table',
    'round',
    'TV',
    'lamps',
    'free standing lamp',
    'living',
    'dining',
    'relaxing',
    'picture'
  ],
  'edgeAligned': ['sofa', 'shelf', 'armchair', 'sideboad', 'double bed', 'single bed', 'bed'],
}

var getAlternatives = function(id, options) {
  if (typeof id !== 'string') return Promise.reject('invalid input')

  options = options || {}

  this.userQuery = options.query || null
  this.searchCount = 0
  this.margin = config['default_margin']
  this.furnitureInfo = null

  var self = this
  return getFurnitureInfo(id)
    .then(function(info){
      self.furnitureInfo = info
      var searchQuery = self.getQuery(self.furnitureInfo)
      return search(searchQuery)
    })
    .then(function(result) {
      return self.verifyResult(result, id)
    })
    .catch(function(error) {
      console.error(error)
    })
}

getAlternatives.prototype.verifyResult = function(result, id) {
  if (this.searchCount > 10 ) {
    return Promise.reject(new Error('No furniture was found'))
  }
  var rawResult = result.filter(function(el){
    return el.productResourceId !== id
  });
  // if we didn't find anything in the first place
  // let's increase dimensions a bit
  var self = this
  if (rawResult.length < 1) {
    if (this.searchCount >= 3) this.margin += 0.10
    var searchQuery = this.getQuery(this.furnitureInfo);
    this.searchCount += 1
    return search(searchQuery)
      .then(function(result) {
        return self.verifyResult(result, id)
      })
      .catch(function(error) {
        console.error('catch', searchQuery.query, error)
        return Promise.reject('No alternatives were found')
      })
  } else {
    var cleanResult = rawResult.map(normalizeFurnitureInfo).map(function(res) {
      return {
        furniture: res,
        offset: getOffset(self.furnitureInfo, res)
      }
    })
    return Promise.resolve(cleanResult)
  }
}

getAlternatives.prototype.getQuery = function(info) {
  var query = config['default_search']
  var tags = this.searchCount < 6 ? info.tags.concat(info.categories) : info.tags
  tags = tags.filter(function(tag) {
    // removes blacklisted tags as well as 1P, 2P, ...
    return config['tag_black_list'].indexOf(tag) < 0 && !/^\d+P$/.test(tag)
  })
  // remove secondary tags from query when increasing dimensions didn't work
  if (this.searchCount > 2) {
    tags = tags.filter(function(tag) {
      return config['tag_white_list'].indexOf(tag) > -1
    })
  }

  query += ' ' + tags.join(' ')
  if (this.userQuery && tags.indexOf('TV') < 0) query += ' ' + this.userQuery
  var searchQuery = {query: query};

  // add dimension search params if source provides dimensions
  var dim = info.boundingBox
  var self = this
  if (dim) {
    ['length', 'height', 'width'].forEach(function(d) {
      if (dim[d] -self.margin > 0) {
        searchQuery[d + 'Min'] = Math.round((dim[d] - self.margin) * 1e2) / 1e2
        searchQuery[d + 'Max'] = Math.round((dim[d] + self.margin) * 1e2) / 1e2
      }
    })
  }
  return searchQuery
}

// helper

function search(searchQuery) {
  // let's make sure we don't have trailing or double spaces
  searchQuery.query = searchQuery.query.trim().replace(/\s+/g, ' ')
  return callService('Product.search', {searchQuery: searchQuery, limit: 200})
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

export default getAlternatives