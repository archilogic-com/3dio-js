const packageInfo = require('../package.json')
const moment = require('moment')
const execSync = require('child_process').execSync

const date = moment().format('YYYY/MM/DD HH:mm')
const gitBranchName = process.env.TRAVIS_BRANCH || execSync(`git rev-parse --abbrev-ref HEAD`).toString('utf8').replace('\n', '')
const gitCommitSha1 = execSync(`git rev-parse HEAD`).toString('utf8').replace('\n', '')

const text = `/**
 * @preserve
 * @name ${packageInfo.name}
 * @version ${packageInfo.version}
 * @date ${date}
 * @branch ${gitBranchName}
 * @commit ${gitCommitSha1}
 * @description ${packageInfo.description}
 * @see ${packageInfo.homepage}
 * @tutorial https://github.com/${packageInfo.repository}
 * @author ${packageInfo.author.name} <${packageInfo.author.email}> (${packageInfo.author.url})
 * @license ${packageInfo.license}
 */
`

module.exports = {
  text: text,
  date: date,
  gitBranchName: gitBranchName,
  gitCommitSha1: gitCommitSha1
}