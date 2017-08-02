export default function addCacheBustToQuery (url) {
  var cacheBust = '___cacheBust='+Date.now()
  if (url.indexOf('?') > -1) {
    // url has query: append cache bust
    url = url.replace('?','?'+cacheBust+'&')
  } else if (url.indexOf('#') > -1) {
    // url has no query but hash: prepend cache bust to hash tag
    url = url.replace('#', '?'+cacheBust+'#')
  } else {
    // no query and no hash tag: add cache bust
    url = url + '?' + cacheBust
  }
  return url
}