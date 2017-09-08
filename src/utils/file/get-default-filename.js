import shortId from '../short-id.js'

export default function getDefaultFilename () {
  var d = new Date()
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + shortId()
}