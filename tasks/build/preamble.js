const packageInfo = require('../../package.json')

module.exports = `/**
 * @preserve
 * @name ${packageInfo.name}
 * @version ${packageInfo.version}
 * @description ${packageInfo.description}
 * @see ${packageInfo.homepage}
 * @tutorial https://github.com/${packageInfo.repository}
 * @author ${packageInfo.author.name} <${packageInfo.author.email}> (${packageInfo.author.url})
 * @license ${packageInfo.license}
 */
`