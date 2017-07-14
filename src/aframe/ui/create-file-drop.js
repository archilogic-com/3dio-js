import Promise from 'bluebird'
import putToStore from '../../storage/put.js'

// configs

var EXTENSION_WHITE_LIST = [
  // generic
  '.json', '.buffer', '.js', '.md', '.txt', '.csv',
  // 3d formats
  '.obj', '.mtl', '.ifc', '.fbx', '.gltf', '.bin',
  // 2d formats
  '.jpg', '.jpeg', '.jpe', '.png', '.gif', '.tga', '.dds', '.svg', '.pdf', '.dxf'
]

// themes

var THEME = {
  bright: {
    box: 'background-color: rgba(255, 255, 255, 0.2); border: 1px dashed rgba(255, 255, 255, 0.7); border-radius: 2px;',
    over: 'background-color: rgba(255, 255, 255, 0.3); border: 1px dashed rgba(255, 255, 255, 1); border-radius: 2px;'
  },
  dark: {
    box: 'background-color: rgba(0, 0, 0, 0.2); border: 1px dashed rgba(0, 0, 0, 0.7); border-radius: 2px;',
    over: 'background-color: rgba(0, 0, 0, 0.3); border: 1px dashed rgba(0, 0, 0, 1); border-radius: 2px;'
  }
}

// main

export default function createFileDrop (args) {

  var elementId = args.elementId
  var onDrop = args.onDrop
  var upload = args.upload !== undefined ? args.upload : true
  var theme = args.theme !== undefined ? args.theme : 'bright'
  var onProgress = args.onProgress

  var el = document.getElementById(elementId)
  if (THEME[theme]) el.setAttribute('style', THEME[theme].box)

  function dragEnter (event) {
    doNothing(event)
    if (THEME[theme]) el.setAttribute('style', THEME[theme].over)
  }

  function dragLeave (event) {
    doNothing(event)
    if (THEME[theme]) el.setAttribute('style', THEME[theme].box)
  }

  function drop (event) {
    doNothing(event)
    getFilesFromDragAndDropEvent(event).then(function (files) {
      if (!upload) {
        // return files
        onDrop(files)
      } else {
        // return keys & files
        return putToStore(files, { onProgress: onProgress }).then(function(keys){
          onDrop(keys, files)
        })
      }
    }).catch(console.error)
  }

  /* events fired on the draggable target */
  // document.addEventListener("drag", function( event ) {}, false)
  // document.addEventListener("dragstart", function( event ) {}, false)
  // document.addEventListener("dragend", function( event ) {}, false)
  // prevent events on window drop
  window.addEventListener('dragover', doNothing, false)
  window.addEventListener('drop', doNothing, false)
  /* events fired on the drop targets */
  el.addEventListener('dragover', function (event) {
    doNothing(event)
    event.dataTransfer.dropEffect = 'copy' // set cursor style
  }, false)
  el.addEventListener('dragenter', dragEnter, false)
  el.addEventListener('dragleave', dragLeave, false)
  el.addEventListener('dragend', dragLeave, false)
  el.addEventListener('drop', drop, false)

}

// helpers

function doNothing (event) {
  event.stopPropagation()
  event.preventDefault()
}

function getFilesFromDragAndDropEvent (event, options) {
  // compatibility function to extract files

  // API
  options = options || {}
  var warningCallback = options.onWarning || function () {}

  // internals
  var result
  var dataTransfer = event.dataTransfer || event.originalEvent.dataTransfer

  if (dataTransfer.items && dataTransfer.items.length) {
    // more sophisticated drop API, supporting folders structures
    // works in webkit browsers only
    // get files with directories
    //http://code.flickr.net/2012/12/10/drag-n-drop/
    result = getFlatFileArrayFromItems(dataTransfer.items).then(function (files) {
      return removeRootDir(filterValidFiles(files, warningCallback))
    })

  } else if (dataTransfer.files) {
    // "classic" drag and drop api, not supporting folders
    // check if user tries to dragdrop a folder = only one "file" with no extension
    var isFolder = dataTransfer.files.length === 0 || (dataTransfer.files.length === 1 && dataTransfer.files[0].name.indexOf('.') < 0)
    if (isFolder) {
      result = Promise.reject('Sorry, but this browser doesn\'t support drag&drop of folders. (use Chrome)')
    } else {
      // create Blobs from Files because in File name property is read only.
      // but we may want file.name to be writable later.
      var i, l, _file, file, files = []
      for (i = 0, l = dataTransfer.files.length; i < l; i++) {
        _file = dataTransfer.files[i]
        file = new Blob([_file], {type: _file.type})
        file.name = _file.name
        files.push(file)
      }
      result = Promise.resolve(filterValidFiles(files, warningCallback))

    }

  } else {

    result = Promise.reject('Event does not contain "items" nor "files" property.')

  }

  return result

}

// helpers

function getFlatFileArrayFromItems (items) {

  // get entries from items
  var entries = [], item
  for (var i = 0, l = items.length; i < l; i++) {
    item = items[i]
    entries[entries.length] = item.webkitGetAsEntry ? item.webkitGetAsEntry() : item.getAsFile()
  }

  // recursively parse directories and collect files
  var files = []
  return recursivelyParseEntries(entries, files).then(function () {
    return files
  })

}

function recursivelyParseEntries (entries, resultArray) {
  return Promise.all(
    entries.map(function (entry) {

      if (entry.isFile) {

        // convert File into Blob
        return new Promise(function (resolve, reject) {
          // add file to file array
          entry
            .file(function (_file) {
              // create Blob from File because in File name property is read only.
              // but we want file.name to include path so we need to overwrite it.
              var file = new Blob([_file], {type: _file.type})
              file.name = entry.fullPath.substring(1)
              resultArray[resultArray.length] = file
              resolve()
            })
        })

      } else if (entry instanceof File) {

        // create Blob from File because in File name property is read only.
        // but we want file.name to include path so we need to overwrite it.
        var file = new Blob([entry], {type: entry.type})
        file.name = entry.name
        // add file to file array
        resultArray[resultArray.length] = file

      } else if (entry.isDirectory) {

        // read directory
        return new Promise(function (resolve, reject) {
          entry
            .createReader()
            .readEntries(function (_entries) {
              resolve(recursivelyParseEntries(_entries, resultArray))
            })
        })

      }
    })
  )
}

function filterValidFiles (_files, warningCallback) {
  var file, fileName, extension, hasValidExtension, filteredFiles = []
  for (var i = 0, l = _files.length; i < l; i++) {
    file = _files[i]
    fileName = file.name
    if (typeof fileName === 'string') {
      // ignore system files
      if (fileName[0] === '.' || fileName.substring(0, 9) === '__MACOSX/') {
        continue
      }
      // check extensions
      extension = fileName.split('.').length > 1 ? '.' + fileName.split('.').pop().toLowerCase() : null
      if (!extension) {
        console.error('File ' + fileName + ' has no extension and will be ignored.')
        warningCallback('File ' + fileName + ' has no extension and will be ignored.')
      } else {
        hasValidExtension = EXTENSION_WHITE_LIST.indexOf(extension) > -1
        if (!hasValidExtension) {
          console.error('File ' + fileName + ' is not supported and will be ignored.')
          warningCallback('File ' + fileName + ' is not supported and will be ignored.')
        } else {
          filteredFiles[filteredFiles.length] = file
        }
      }
    }
  }
  return filteredFiles
}

function removeRootDir (files) {
  // get root dir from first file
  var rootDir, i, l
  if (files.length && files[0].name && files[0].name.indexOf('/') > -1) {
    rootDir = files[0].name.split('/')[0]
  } else {
    return files
  }

  // check if all files have the same root dir
  var hasSameRootDir
  for (i = 1, l = files.length; i < l; i++) {
    hasSameRootDir = files[i].name && files[i].name.indexOf('/') > -1 && files[i].name.split('/')[0] === rootDir
    if (!hasSameRootDir) {
      return files
    }
  }

  // remove root dir from file names
  for (i = 0, l = files.length; i < l; i++) {
    files[i].name = files[i].name.substring(rootDir.length + 1)
  }

  // iterate recursively until all equal leading directories are removed
  return removeRootDir(files)

}