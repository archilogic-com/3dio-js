// from https://github.com/jbgutierrez/path-parse
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

function parsePath (path) {
  if (typeof path !== 'string') {
    throw new TypeError(
      "Parameter 'path' must be a string, not " + typeof path
    );
  }
  var allParts = splitPathRe.exec(path).slice(1)
  if (!allParts || allParts.length !== 4) {
    throw new TypeError("Invalid path '" + path + "'");
  }
  allParts[2] = allParts[2] || '';
  allParts[3] = allParts[3] || '';

  return {
    root: allParts[0],
    dir: allParts[0] + allParts[1].slice(0, -1),
    base: allParts[2],
    ext: allParts[3],
    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
  }
}

export default {
  parse: parsePath
}