const gulp = require('gulp')
const jshintConfigs = require('./jshint-configs')
const jshint = require('gulp-jshint')
const jshintReporter = require('jshint-stylish')

module.exports = function runJshint () {
  return gulp.src('src/**/*.js')
    .pipe(jshint(jshintConfigs))
    .pipe(jshint.reporter(jshintReporter))
    .pipe(jshint.reporter({
      reporter: function(errors) {
        if (errors.length) {
          console.error(`Stopped after ${errors.length} JSHINT Errors.`)
          process.exit(1)
        }
      }
    }))
}