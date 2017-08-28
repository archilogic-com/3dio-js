import runtime from '../../core/runtime.js'
import fetch from './fetch.js'

export default function fetchModule (url) {
  runtime.assertBrowser('Please use "require()" to fetch modules in server environment.')
  
  return fetch(url).then(function(response){
    return response.text()
  }).then(function(code){
    // module wrapper
    window.___modules = window.___modules || {}
    //console.log(code)
    var moduleWrapper = 'window.___modules["'+url+'"] = (function(){ var exports = {}, module = {exports:exports};'+code+'\nreturn module.exports\n})()'
    var script = document.createElement('script')
    try {
      script.appendChild(document.createTextNode(moduleWrapper))
      document.body.appendChild(script)
    } catch (e) {
      script.text = moduleWrapper
      document.body.appendChild(script)
    }
    return window.___modules[url]
  })
}