import getFurnitureInfo  from '../furniture/get-info.js'
import callService  from '../utils/services/call.js'

var filter, searchCount, margin, furnitureInfo

var config = {
  'default_margin': 0.1,
  'default_search': '-generic isPublished:true',
  'tag_black_list': ['simplygon', 'hasChangeableMaterials', 'autofurnishing', 'wallAttached', 'daybed'],
}

export default function replaceFurniture (id, options) {

  // API
  options = options || {}
  filter = options.filter || null
  // config publishable api key
  // reject when no publishable or not white listed domain
  // we need to call furniture info first in order to obtain data3d URL
  return getFurnitureInfo(id)
    .then(function(info){
      furnitureInfo = info
      margin = config['default_margin']
      searchCount = 0
      var searchQuery = getQuery(furnitureInfo)
      console.log(searchQuery)
      return search(searchQuery)
    })
    .then(function(result) {
      console.log(result)
      return verifyResult(result, id)
    })
    .catch(function(error) {
      /* error */
    })
}

function verifyResult(result, id) {
  if (searchCount > 10 ) {
    return Promise.reject()
  }
  var cleanResult = result.filter(function(el){
    if (el.productResourceId === id) console.log(el.productDisplayName)
    return el.productResourceId !== id
  });

  if (cleanResult.length < 2) {
    margin += 0.10
    searchCount += 1
    var searchQuery = getQuery(furnitureInfo);
    console.log('try one more time', searchCount, searchQuery);
    return search(searchQuery).then(function(result) {
      return verifyResult(result, id)
    })
  } else {
    console.log('we found:', cleanResult)
    return Promise.resolve(cleanResult)
  }
}

function search(searchQuery) {
  return callService('Product.search', {searchQuery: searchQuery, limit: 200})
}

function getQuery(info, filter) {
  var query = config['default_search']
  var tags = info.tags

  tags.forEach(function(tag) {
    if (config['tag_black_list'].indexOf(tag) < 0 ) {
      query += ' ' + tag
    }
  })

  var categories = info.categories
  var dim = info.boundingBox

  query += ' categories:' + categories[0]
  if (filter) query += ' ' + filter

  query = query.trim()
  var searchQuery = {query: query};
  // add dimension search params
  ['length', 'height', 'width'].forEach(d => {
    if (dim[d] - margin > 0) searchQuery[d + 'Min'] = Math.round((dim[d] - margin) * 100)/100
    searchQuery[d + 'Max'] = Math.round((dim[d] + margin) * 100)/100
  })
  return searchQuery
}