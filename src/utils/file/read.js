import runtime from '../../core/runtime.js'

var FILE_READ_METHODS = {
  undefined: 'readAsText',
  text: 'readAsText',
  dataUrl: 'readAsDataURL',
  binaryString: 'readAsBinaryString',
  arrayBuffer: 'readAsArrayBuffer'
}

export default function readFile(blob, type) {
  runtime.assertBrowser()
  
  return new Promise(function(resolve, reject){
    var fileReader = new window.FileReader()
    fileReader.onload = function (e) {
      // IE 11 requires this
      // http://stackoverflow.com/a/32665193/2835973
      resolve(fileReader.content || fileReader.result)
    }
    fileReader.onerror = function (err){
      reject(err)
    }
    // start reading file
    fileReader[ FILE_READ_METHODS[type] ](blob)
  })
}