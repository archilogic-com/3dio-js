import Promise from 'bluebird'
import runtime from '../../core/runtime.js'
import putToStore from '../../storage/put.js'
import getFilesFromDragAndDropEvent from './create-file-drop-ui/get-files-from-drag-and-drop-event.js'

// main

export default function createFileDropUi (args) {
  runtime.assertBrowser()

  // API

  // html
  var elementId = args.elementId
  var onInput = args.onInput
  var dragOverCssClass = args.dragOverCssClass
  // drag events
  var onDragEnter = args.onDragEnter
  var onDragLeave = args.onDragLeave
  // upload related
  var upload = args.upload !== undefined ? args.upload : true
  var onUploadProgress = args.onUploadProgress
  var uploadProgressBarCss = args.uploadProgressBarCss || 'background: rgba(0,0,0,0.2);'

  // DOM

  // get reference to main DOM element
  var mainEl = document.getElementById(elementId)
  // input allows selecting files on click
  var fileInputEl = document.createElement('input')
  fileInputEl.setAttribute('type', 'file')
  fileInputEl.setAttribute('multiple', true)
  fileInputEl.setAttribute('style', 'cursor:pointer; position:absolute; top:0; left:0; height:100%; width:100%; opacity:0;')
  mainEl.appendChild(fileInputEl)
  // progress bar
  var progressBarEl = document.createElement('div')
  progressBarEl.setAttribute('style', 'position:absolute; top:0; left:0; bottom:0; width:0; transition: width 1s linear;'+uploadProgressBarCss)
  if(mainEl.style.position === null) mainEl.style.position = 'relative'
  mainEl.appendChild(progressBarEl)

  // events

  function dragEnter (event) {
    if (dragOverCssClass) mainEl.classList.add(dragOverCssClass)
    if (onDragEnter) onDragEnter(event)
    preventBrowserDefaults(event)
  }

  function dragLeave (event) {
    if (dragOverCssClass) mainEl.classList.remove(dragOverCssClass)
    if (onDragLeave) onDragLeave(event)
    preventBrowserDefaults(event)
  }

  function dropFiles (event) {
    if (dragOverCssClass) mainEl.classList.remove(dragOverCssClass)
    preventBrowserDefaults(event)
    getFilesFromDragAndDropEvent(event).then(function (files) {
      handleFileInput(files, event)
    }).catch(console.error)
  }

  function selectFiles (event) {
    // convert FileList into array
    // https://developer.mozilla.org/en/docs/Web/API/FileList
    var files = [], fileList = event.target.files
    for (var i = 0; i < fileList.length; i++) files[i] = fileList[i]
    handleFileInput(files, event)
  }

  function handleFileInput(files, event) {
    // uploading files is optional
    (upload ? uploadFiles(files) : Promise.resolve()).then(function(storageIds){
      // create convenient collection with file info including storageIds if available
      var fileCollection = files.map(function(file, i){
        var item = { file: file, name: file.name, size: file.size, type: file.type }
        if (storageIds) {
          item.storageId = storageIds[i]
          item.url = 'https://storage.3d.io' + storageIds[i]
        }
        return item
      })
      onInput(fileCollection, event)
    })
  }

  function uploadFiles (files) {
    progressBarEl.style.width = '0'
    progressBarEl.style.display = 'block'
    return putToStore(files, {
      onProgress: function onProgress(uploaded, total) {
        progressBarEl.style.width = Math.min(100, Math.round(100 * (uploaded / total))) + '%'
        if (onUploadProgress) onUploadProgress(uploaded, total)
      }
    }).then(function (storageIds) {
      progressBarEl.style.display = 'none'
      progressBarEl.style.width = '0'
      return storageIds
    })
  }

  // events fired on the draggable target
  // document.addEventListener("drag", function( event ) {}, false)
  // document.addEventListener("dragstart", function( event ) {}, false)
  // document.addEventListener("dragend", function( event ) {}, false)
  // prevent events on window drop
  window.addEventListener('dragover', preventBrowserDefaults, false)
  window.addEventListener('drop', preventBrowserDefaults, false)
  // events fired on the drop targets
  fileInputEl.addEventListener('dragover', function (event) {
    preventBrowserDefaults(event)
    event.dataTransfer.dropEffect = 'copy' // // adds a little "+" to mouse cursor
  }, false)
  fileInputEl.addEventListener('dragenter', dragEnter, false)
  fileInputEl.addEventListener('dragleave', dragLeave, false)
  fileInputEl.addEventListener('dragend', dragLeave, false)
  fileInputEl.addEventListener('drop', dropFiles, false)
  // events from input element
  fileInputEl.addEventListener('change', selectFiles, false)

}

// helpers

function preventBrowserDefaults (event) {
  event.stopPropagation()
  event.preventDefault()
}