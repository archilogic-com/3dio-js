export default function sendJsonRequest(url, method, type, data){
  return new Promise(function (resolve, reject) {

    // internals
    var jsonString = null
    var triedPreflightWorkaround = false

    // preprocess data
    if (data) {
      try {
        jsonString = JSON.stringify(data)
      } catch (e) {
        reject('Error creating JSON string.')
      }
    }

    // create request
    var xhr = new XMLHttpRequest()
    xhr.crossOrigin = 'Anonymous'

    xhr.onload = function (event) {
      // parse data
      var json
      try {
        json = JSON.parse(xhr.responseText)
      } catch (e) {
        reject({
          message: 'Http Request failed: Error parsing response JSON',
          url: url,
          status: xhr.status,
          headers: xhr.getAllResponseHeaders(),
          event: event
        })
        return
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(json)
      } else {
        reject(json)
      }
    }
    xhr.onerror = function (event) {

      // When CORS preflight fails then xhr.status is 0
      if (!triedPreflightWorkaround && xhr.status === 0) {

        // try again with simple header to avoid OPTIONS preflight
        triedPreflightWorkaround = true
        xhr.open(method, url, true)
        xhr.setRequestHeader('Content-Type', 'text/plain')
        xhr.send(jsonString)

      } else {

        reject({
          message: 'Http Request error',
          url: url,
          status: xhr.status,
          headers: xhr.getAllResponseHeaders(),
          event: event
        })

      }

    }

    xhr.open(method, url, true)
      if (method !== 'GET') {
          xhr.setRequestHeader('Content-Type', 'application/json')
      }
    xhr.send(jsonString)
    
  })
}