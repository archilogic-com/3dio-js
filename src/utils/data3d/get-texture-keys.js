import traverseData3d from './traverse.js'
import textureAttributes from './texture-attributes.js'

// main

export default function getTextureKeys(data3d, options) {
  // API
  var options = options || {}
  var filter = options.filter

  // internals
  var cache = {}

  // iterate over materials
  traverseData3d.materials(data3d, function(material) {
    var filteredResult, attrName, type, format, textureKey
    // iterate over texture types
    for (var i = 0, l = textureAttributes.names.length; i < l; i++) {
      attrName = textureAttributes.names[i]
      textureKey = material[attrName]

      // material does not contain this type of texture - continue to next one
      if (!textureKey) continue

      // apply filter function if specified in options
      if (filter) {
        // provide info on type and format of texture to the filter function
        type = textureAttributes.nameToType[attrName]
        format = textureAttributes.nameToFormat[attrName]
        textureKey = filter(textureKey, type, format, material, data3d)
      }

      // filter function might return false in order to exclude textures from the results
      if (textureKey) cache[textureKey] = true
    }
  })

  return Object.keys(cache)
}