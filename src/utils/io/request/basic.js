import Promise from 'bluebird'

export default function sendBasicRequest (url, method, type, body){
  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest()
    xhr.onload = function (event) {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject('Http request to '+url+' returned status: '+xhr.status+'. Body:\n'+xhr.response)
      }
    }
    xhr.onerror = function (event) {
      reject('Http request error. URL: '+url)
    }
    xhr.open(method, url, true)
    xhr.crossOrigin = 'Anonymous'
    xhr.responseType = type.toLowerCase()
    xhr.send(body)

  })
}