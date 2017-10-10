// gulp 4 - https://github.com/gulpjs/gulp/tree/4.0
const gulp = require('gulp')

// register tasks for command line
gulp.task('dev-browser', require('./tasks/dev-browser'))
gulp.task('dev-node', require('./tasks/dev-node'))
gulp.task('build', require('./tasks/build'))
gulp.task('jshint', require('./tasks/jshint.js'))
gulp.task('test', require('./tasks/test'))
gulp.task('release', require('./tasks/release'))
