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
  var dragOverCssClass = args.dragOverCssClass
  // mouse events
  var onDragEnter = args.onDragEnter
  var onDragLeave = args.onDragLeave
  var onDrop = args.onDrop
  // upload related
  var upload = args.upload !== undefined ? args.upload : true
  var onUploadProgress = args.onUploadProgress
  var uploadProgressBarCss = args.uploadProgressBarCss || 'background: rgba(0,0,0,0.2);'

  // DOM

  // get reference to main DOM element
  var mainEl = document.getElementById(elementId)
  // progress bar
  var progressBarEl = document.createElement('div')
  progressBarEl.setAttribute('style', 'position:absolute; top:0; left:0; bottom:0; width:0; transition: width 1s linear;'+uploadProgressBarCss)
  if(mainEl.style.position === null ) mainEl.style.position = 'relative'
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

  function drop (event) {
    if (dragOverCssClass) mainEl.classList.remove(dragOverCssClass)
    preventBrowserDefaults(event)
    getFilesFromDragAndDropEvent(event).then(function (files) {
      if (!upload) {
        // return files
        onDrop(files, event)
      } else {
        // return keys & files
        progressBarEl.style.display = 'block'
        return putToStore(files, {onProgress: function onProgress(uploaded, total) {
          progressBarEl.style.width = Math.min(100, Math.round(100 * (uploaded / total))) + '%'
          if (onUploadProgress) onUploadProgress(uploaded, total)
        }}).then(function (storageIds) {
          progressBarEl.style.display = 'none'
          progressBarEl.style.width = '0'
          var fileCollection = storageIds.map(function(storageId, i){
            return {
              storageId: storageId,
              url: 'https://storage.3d.io' + storageId,
              file: files[i],
              filename: files[i].name
            }
          })
          onDrop(fileCollection, event)
        })
      }
    }).catch(console.error)
  }

  /* events fired on the draggable target */
  // document.addEventListener("drag", function( event ) {}, false)
  // document.addEventListener("dragstart", function( event ) {}, false)
  // document.addEventListener("dragend", function( event ) {}, false)
  // prevent events on window drop
  window.addEventListener('dragover', preventBrowserDefaults, false)
  window.addEventListener('drop', preventBrowserDefaults, false)
  /* events fired on the drop targets */
  mainEl.addEventListener('dragover', function (event) {
    preventBrowserDefaults(event)
    event.dataTransfer.dropEffect = 'copy' // set cursor style
  }, false)
  mainEl.addEventListener('dragenter', dragEnter, false)
  mainEl.addEventListener('dragleave', dragLeave, false)
  mainEl.addEventListener('dragend', dragLeave, false)
  mainEl.addEventListener('drop', drop, false)

}

// helpers

function preventBrowserDefaults (event) {
  event.stopPropagation()
  event.preventDefault()
}