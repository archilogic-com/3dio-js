const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const del = require('del')
const gzip = require('gulp-gzip')
const s3 = require('gulp-s3')
const through2 = require('through2')
const Vinyl = require('vinyl')
const UglifyJS = require('uglify-js')
const packageInfo = require('../package.json')
const preamble = require('./preamble.js')
const execSync = require('child_process').execSync
const git = require('gulp-git')

// internals

const version = packageInfo.version
const latestNpmVersion = execSync(`npm view ${packageInfo.name} version`).toString('utf8').replace('\n', '')

// configs

const src = 'build'
const dest = 'release'
const awsConfig = {
  bucket: '3d.io',
  region: 'eu-west-1',
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY
}
const awsDir = {
  version: `releases/3dio-js/${version}/`,
  latestMinor: `releases/3dio-js/${getLatestMinor(version)}/`,
  latestPatch: `releases/3dio-js/${getLatestPatch(version)}/`
}

// tasks

const release = gulp.series(
  checkNpmVersion,
  require('./build'),
  cleanDistDir,
  uglify,
  commitBuild,
  publishToNpm,
  uploadCompressed
)

function cleanDistDir () {
  return del([dest]).then(function () {
    fs.mkdirSync(process.cwd() + `/${dest}`, 0744)
    fs.mkdirSync(process.cwd() + `/${dest}/${version}`, 0744)
  })
}

function uglify () {
  return gulp.src(src + '/*.js').pipe(through2.obj((inputFile, enc, cb) => {
    // process files only
    if (!inputFile.isBuffer()) return
    // get filename without extension
    var cwd = process.cwd()
    var sourceBasename = inputFile.basename.substr(0, inputFile.basename.length - 3)
    var targetBasename = sourceBasename //+'-'+version
    // decode text from vinyl object
    const ugly = UglifyJS.minify(inputFile.contents.toString(enc), {
      warnings: true, mangle: true, ie8: false,
      compress: {dead_code: true, toplevel: true, passes: 3},
      output: {preamble: preamble.text, beautify: false},
      sourceMap: {
        content: read(`${src}/${sourceBasename}.js.map`),
        url: `${targetBasename}.min.js.map`
      }
    })
    if (ugly.warnings) console.log('UGLIFY WARNINGS: ', ugly.warnings)
    if (ugly.error) return Promise.reject(ugly.error)
    // write files
    fs.writeFileSync(`${cwd}/${dest}/${version}/${targetBasename}.min.js.map`, ugly.map)
    fs.writeFileSync(`${cwd}/${dest}/${version}/${targetBasename}.min.js`, ugly.code)
    // gulp callback
    cb()
  }))
}

function commitBuild () {
  return gulp.src(['build/*', 'package.json'])
    .pipe(git.commit('Build'))
}

function checkNpmVersion () {
  if (latestNpmVersion === version ) {
    throw new Error('Version '+version+' has been published to NPM already. Did you forget to bump version number?')
  }
  return Promise.resolve()
}

function publishToNpm () {
  console.log('Publishing version '+version+' to NPM (latest: '+latestNpmVersion+')')
  execSync(`npm publish`).toString('utf8').replace('\n', '')
  return Promise.resolve()
}

function uploadCompressed () {
  return gulp.src(`${dest}/${version}/**/**`)
    .pipe(gzip({
      append: false, // do not append .gz extension
      threshold: false, // no file size treshold because all files will have gzip headers
      gzipOptions: {level: 9}
    }))
    .pipe(s3(awsConfig, {
      uploadPath: awsDir.version,
      headers: {
        'Content-Encoding': 'gzip',
        'Cache-Control': 'max-age=' + (60*60*24*365) // 1 year
      },
      failOnError: true
    }))
    .pipe(s3(awsConfig, {
      uploadPath: awsDir.latestMinor,
      headers: {
        'Content-Encoding': 'gzip',
        'Cache-Control': 'max-age=' + (60*60) // 1 hour
      },
      failOnError: true
    }))
    .pipe(s3(awsConfig, {
      uploadPath: awsDir.latestPatch,
      headers: {
        'Content-Encoding': 'gzip',
        'Cache-Control': 'max-age=' + (60*60) // 1 hour
      },
      failOnError: true
    }))
}

// helpers

function read (path) {
  return fs.readFileSync(path, `utf8`)
}

function getLatestMinor (version) {
  return `${version.split('.')[0]}.x.x${getAppendix(version)}`
}

function getLatestPatch (version) {
  const parts = version.split('.')
  return `${parts[0]}.${parts[1]}.x${getAppendix(version)}`
}

function getAppendix (version) {
  let appendix = ''
  if (version.indexOf('-alpha') > -1) {
    appendix = '-alpha'
  } else if (version.indexOf('-beta') > -1) {
    appendix = '-beta'
  } else if (version.split('-')[1]) {
    appendix = version.split('-').slice(1).join('-')
  }
  return appendix
}

// export

module.exports = release