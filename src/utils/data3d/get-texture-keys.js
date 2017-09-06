import traverseData3d from './traverse.js'

export default function getTextureKeys (data3d, options) {

  // API
  var options = options || {}
  var filter = options.filter

  // internals
  var cache = {}

  // internals
  traverseData3d.materials(data3d, function(material) {

    var filteredResult, attr, type, format, value
    for (var i=0, l=ATTRIBUTES.length; i<l; i++) {

      attr = ATTRIBUTES[i]
      value = material[attr]

      // apply filter function if specified in options
      if (filter) {
        // provide info on type and format of texture to the filter function
        type = ATTRIBUTE_TO_TYPE[attr]
        format = ATTRIBUTE_TO_FORMAT[attr]
        value = filter(value, type, format, material, data3d)
      }

      if (value) cache[value] = true

    }

  })

  return Object.keys(cache)

}

// constants

var ATTRIBUTES = [
  'mapDiffuse',
  'mapDiffusePreview',
  'mapDiffuseSource',
  // specular
  'mapSpecular',
  'mapSpecularPreview',
  'mapSpecularPreview',
  // normal
  'mapNormal',
  'mapNormalPreview',
  'mapNormalPreview',
  // alpha
  'mapAlpha',
  'mapAlphaPreview',
  'mapAlphaPreview',
]

var ATTRIBUTE_TO_TYPE = {
  // diffuse
  mapDiffuse: 'diffuse',
  mapDiffusePreview: 'diffuse',
  mapDiffuseSource: 'diffuse',
  // specular
  mapSpecular: 'specular',
  mapSpecularPreview: 'specular',
  mapSpecularPreview: 'specular',
  // normal
  mapNormal: 'normal',
  mapNormalPreview: 'normal',
  mapNormalPreview: 'normal',
  // alpha
  mapAlpha: 'alpha',
  mapAlphaPreview: 'alpha',
  mapAlphaPreview: 'alpha',
}

var ATTRIBUTE_TO_FORMAT = {
  // loRes
  mapDiffusePreview: 'loRes',
  mapSpecularPreview: 'loRes',
  mapNormalPreview: 'loRes',
  mapAlphaPreview: 'loRes',
  // source
  mapDiffuseSource: 'source',
  mapSpecularSource: 'source',
  mapNormalSource: 'source',
  mapAlphaSource: 'source',
  // dds
  mapDiffuse: 'dds',
  mapSpecular: 'dds',
  mapNormal: 'dds',
  mapAlpha: 'dds',
}