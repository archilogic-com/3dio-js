// const Promise = require('bluebird')
// const path = require('path')
const spawn = require('child_process').spawn
const gulp = require('gulp')
const del = require('del')
const rollup = require('gulp-better-rollup')
const sourcemaps = require('gulp-sourcemaps')
const json = require('rollup-plugin-json')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const chalk = require('chalk')

// configs

const dest = 'build'

// tasks

const build = gulp.series(cleanBuildDir, bundleScripts)

function cleanBuildDir () {
  return del([dest])
}

function bundleScripts () {
  return new Promise((resolve, reject) => {
    const ls = spawn('rollup', ['-c','tasks/rollup.config.js'], {shell: true} )
    ls.stdout.on('data', (data) => {
      console.log(`rollup: ${data}`)
    })
    ls.stderr.on('data', (data) => {
      console.error(chalk.red(`rollup: ${data}`))
    })
    ls.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        throw new Error(`rollup: exited with code ${code}`)
        reject()
      }
    })
  })
}

// export build task

module.exports = build