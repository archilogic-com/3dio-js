const gulp = require('gulp')

/*
 * register tasks for command line
 */

gulp.task('dev', require('./tasks/dev').dev)
gulp.task('node-example', require('./tasks/dev').runNodeExample)
gulp.task('build', require('./tasks/build'))
gulp.task('dist', require('./tasks/dist'))
gulp.task('test', require('./tasks/test'))