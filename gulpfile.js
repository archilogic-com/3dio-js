const gulp = require('gulp')
const execSync = require('child_process').execSync

gulp.task('dev', gulp.series(
  require('./tasks/build').build,
  require('./tasks/build').watch
))
gulp.task('build', require('./tasks/build').build)
gulp.task('dist', require('./tasks/dist'))
gulp.task('test', function(){
  throw new Error(`No test specified`)
})
gulp.task('node-example', function(){
  execSync(`node examples/node/main.js`).toString('utf8')
  return Promise.resolve()
})