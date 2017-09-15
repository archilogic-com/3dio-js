const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const del = require('del')
const gzip = require('gulp-gzip')
const s3 = require('gulp-s3')
const through2 = require('through2')
const Vinyl = require('vinyl')
const UglifyJS = require('uglify-js')
const build = require('./build.js')
const test = require('./test.js')
const packageInfo = require('../package.json')
const preamble = require('./preamble.js')
const execSync = require('child_process').execSync
const git = require('gulp-git')

// internals

const version = packageInfo.version
const branchName = preamble.gitBranchName
const latestNpmVersion = execSync(`npm view ${packageInfo.name} version`).toString('utf8').replace('\n', '')

// configs

const srcDir = 'build'
const destDir = 'release'
const gitCommitMessage = 'Release '+version
const awsConfig = {
  bucket: '3dio-dist',
  region: 'eu-west-1',
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY
}
const awsDir = {
  version: `3dio-js/${version}/`,
  latestMinor: `3dio-js/${getLatestMinor(version)}/`,
  latestPatch: `3dio-js/${getLatestPatch(version)}/`
}

// tasks

const release = gulp.series(
  checkLocalEnv,
  checkWorkingDirectoryClean,
  checkBranchName,
  npmCheckVersion,
  test,
  build,
  cleanDestDir,
  uglify,
  gitTag,
  gitCommit,
  gitPush,
  npmPublish,
  s3Upload
)

function checkLocalEnv() {
  if(!awsConfig.key || !awsConfig.secret) throw 'ERROR: You need to set $AWS_ACCESS_KEY_ID and $AWS_SECRET_ACCESS_KEY to be able to upload to S3'
  try {
    execSync('npm who')
  } catch(e) {
    throw 'ERROR: You need to be logged in with npm to release! Run "npm login" first.'
  }
  return Promise.resolve()
}

function checkWorkingDirectoryClean() {
  return new Promise(function (resolve, reject) {
    git.status({ args: '--porcelain' }, function (err, status) {
      if(status === '') {
        resolve()
      } else {
        throw 'Aborting due to uncommitted changes:\n' + status
      }
    })
  })
}

function checkBranchName () {
  if (branchName !== 'master') {
    throw 'ERROR: Releasing is only allowed from master branch.'
  } else {
    return Promise.resolve()
  }
}

function cleanDestDir () {
  return del([destDir]).then(function () {
    fs.mkdirSync(process.cwd() + `/${destDir}`, 0744)
    fs.mkdirSync(process.cwd() + `/${destDir}/${version}`, 0744)
  })
}

function uglify () {
  return gulp.src(srcDir + '/*.js').pipe(through2.obj((inputFile, enc, cb) => {
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
        content: read(`${srcDir}/${sourceBasename}.js.map`),
        url: `${targetBasename}.min.js.map`
      }
    })
    if (ugly.warnings) console.log('UGLIFY WARNINGS: ', ugly.warnings)
    if (ugly.error) return Promise.reject(ugly.error)
    // write files
    fs.writeFileSync(`${cwd}/${destDir}/${version}/${targetBasename}.min.js.map`, ugly.map)
    fs.writeFileSync(`${cwd}/${destDir}/${version}/${targetBasename}.min.js`, ugly.code)
    // gulp callback
    cb()
  }))
}

function gitTag () {
  return new Promise(function (resolve, reject) {
    git.tag('v'+version, '', function (err) {
      if (err) {
        // graceful error handling because not critical. i.e. tag may already exist when
        // a previous release failed at a later step and the release has to be repeated.
        console.warn('Git tag error: ', err)
      }
      resolve()
    })
  })
}

function gitCommit () {
  return gulp.src(['build/*', 'package.json', 'package-lock.json'])
    .pipe(git.commit(gitCommitMessage))
}

function gitPush () {
  return new Promise(function (resolve, reject) {
    git.push('origin', ['master'], {args: " --tags"}, function (err) {
      if (err) throw err
      resolve()
    })
  })
}

function npmCheckVersion () {
  if (latestNpmVersion === version ) {
    throw new Error('Version '+version+' has been published to NPM already. Did you forget to bump version number?')
  }
  return Promise.resolve()
}

function npmPublish () {
  console.log('Publishing version '+version+' to NPM (latest: '+latestNpmVersion+')')
  execSync(`npm publish`).toString('utf8').replace('\n', '')
  return Promise.resolve()
}

function s3Upload () {
  return gulp.src(`${destDir}/${version}/**/**`)
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
        'Cache-Control': 'max-age=' + (60*5) // 5 minutes
      },
      failOnError: true
    }))
    .pipe(s3(awsConfig, {
      uploadPath: awsDir.latestPatch,
      headers: {
        'Content-Encoding': 'gzip',
        'Cache-Control': 'max-age=' + (60*5) // 5 minutes
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