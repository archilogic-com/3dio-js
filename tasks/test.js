const gulp = require('gulp')
const ava = require('gulp-ava')

module.exports = () => {
  return gulp.src('test/*.js')
    .pipe(ava())
}