export default function getShortId (length) {
  length = length || 6
  var shortId = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) shortId += possible.charAt(Math.floor(Math.random() * possible.length))
  return shortId
}