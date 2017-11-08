// current configs guide lines:
// https://github.com/archilogic-com/3dio-js/issues/64
// docs:
// https://github.com/jshint/jshint/blob/master/src/messages.js
// https://gist.github.com/haschek/2595796

module.exports = {
  esversion: 6,
  undef: true,
  unused: false,
  asi: true, // Missing semicolon
  eqeqeq: false,
  '-W041': false,
  '-W002': false,
  '-W080': false,
  '-W032': false,
  '-W030': false,
  '-W046': false,
  '-W008': false,
  '-W083': false,
  '-W084': false,
  '-W054': false,
  '-W009': false,
  '-W010': false,
  '-W047': false,
  '-W018': false,
  '-W027': false,
  '-W055': false,
  '-W086': false,
  laxcomma  : true,
  laxbreak  : true,
  sub:true,
  shadow:true,
  browser: true,
  node: true,
  devel: true,
  validthis: true,
  globals: {
    'escape': true,
    'THREE': true,
    'AFRAME': true,
    'io3d': true,
    'GIT_BRANCH': true,
    'GIT_COMMIT': true,
    'BUILD_DATE': true
  }
}