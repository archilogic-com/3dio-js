const gulp = require('gulp')
const ava = require('gulp-ava')

module.exports = function runTests () {
  return gulp.src('test/*.js')
    .pipe(ava())
}