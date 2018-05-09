export default {
  ensureBeginsWithSlash : function (path) {
    if ( ! (path[0]==='/') ) {
      return '/'+path
    } else {
      return path
    }
  }
}
