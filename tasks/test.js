const gulp = require('gulp')
const ava = require('gulp-ava')

module.exports = gulp.task('test', () => {
  return gulp.src('test/*.js')
    .pipe(ava())
})