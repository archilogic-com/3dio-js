/**
 * @overview Embed text from files using template style placeholders.
 * @example "@description A short description followed by ${additional-long-info.md}"
 * @module plugins/embed-file
 * @author Tomas Polach <tomas@archilogic.com>
 */
'use strict';

var fs = require('fs')
var path = require('path')

exports.handlers = {
  beforeParse: function (e) {
    e.source = e.source.replace( /\$embed{([^}\n]*)}/gmi, function ($, filename) {
      return $.replace( /\$embed{[^}\n]*}/gmi,
        // path relative to code file dir
        fs.readFileSync(path.resolve(path.dirname(e.filename), filename), 'utf8')
      )
    })
  }
}