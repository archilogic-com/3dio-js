// const Promise = require('bluebird')
// const path = require('path')
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
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

const dest = 'build'

/*
 * tasks
 */

function cleanBuildDir () {
  return del([dest])
}

function bundleScripts () {
  return new Promise((resolve, reject) => {
    const ls = spawn('./node_modules/.bin/rollup', ['-c','tasks/rollup.config.js'])
    ls.stdout.on('data', (data) => {
      console.log(`rollup out: ${data}`)
    })
    ls.stderr.on('data', (data) => {
      console.error(`rollup err: ${data}`)
    })
    ls.on('close', (code) => {
      if (code === 0) {
        console.log(`rollup bundle: DONE`)
        resolve()
      } else {
        throw new Error(`rollup exited with code ${code}`)
        reject()
      }
    })
  })
}

/*
 * export
 */

module.exports = gulp.series(cleanBuildDir, bundleScripts)