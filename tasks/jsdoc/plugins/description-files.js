var fs = require('fs')
var path = require('path')

exports.handlers = {
  beforeParse: function (e) {
    e.source = e.source.replace(/@description.*\${(.*\.md)}.*\n/gmi, function ($, descriptionFilename) {

      var descriptionPath = path.resolve(path.dirname(e.filename), descriptionFilename)
      var description = fs.readFileSync(descriptionPath, 'utf8')
      return $.replace(/\${.*\.md}/gmi, description)

    })
  }
}