// const Promise = require('bluebird')
// const path = require('path')
const execSync = require('child_process').execSync
const gulp = require('gulp')
const del = require('del')
const rollup = require('gulp-better-rollup')
const sourcemaps = require('gulp-sourcemaps')
const json = require('rollup-plugin-json')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')

const gitBranchName = process.env.TRAVIS_BRANCH || execSync(`git rev-parse --abbrev-ref HEAD`).toString('utf8').replace('\n', '')
const gitCommitSha1 = execSync(`git rev-parse HEAD`).toString('utf8').replace('\n', '')

/*
 * configs
 */

const debug = true
const src = {
  // bundleEntries: [
  //   'src/3d-io.js'
  // ],
  watch: [
    'src/**/**'
  ]
}
const dest = 'build'

/*
 * tasks
 */

function cleanBuildDir () {
  return del([dest])
}

// 1. bundle modules

function bundleScripts () {
  var result = execSync(`node_modules/.bin/rollup -c tasks/rollup.config.js`).toString('utf8')
  console.log(result)
  return Promise.resolve()
}

function watch () {
  gulp.watch(src.watch, bundleScripts)
}

/*
 * export
 */

module.exports = {
  watch: watch,
  build: gulp.series( cleanBuildDir, bundleScripts )
}