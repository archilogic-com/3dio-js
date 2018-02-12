import runtime from '../../core/runtime.js'
import fetchScript from '../io/fetch-script.js'
import readFile from './read.js'
import getMimeTypeFromFileName from './get-mime-type-from-filename.js'

// API

var gzip = {
  inflate: inflate,
  inflateFile: inflateFile,
  deflate: deflate,
  deflateFile: deflateFile
}

export default gzip

// internals

var PAKO_LIB = {
  deflate: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_deflate.min.js',
    module: 'pako/deflate'
  },
  inflate: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/pako/1.0.5/pako_inflate.min.js',
    module: 'pako/inflate'
  }
}

// methods

function inflate (input) {
  return loadInflateLib().then(function (pakoInflate) {
    return pakoInflate.ungzip(input)
  })
}

function inflateFile (gzippedFile) {
  return loadInflateLib().then(function (pakoInflate) {
    return readFile(gzippedFile, 'arrayBuffer')
      .then(pakoInflate.ungzip)
      .then(function(arrayBuffer){
        var file = new Blob([ arrayBuffer ], { type: getMimeTypeFromFileName(gzippedFile.name) })
        // remove '.gz.' tag from filename
        if (gzippedFile.name) {
          file.name = gzippedFile.name.replace('.gz.','.')
        }
        return file
      })
  })
}

function deflate (input) {
  return loadDeflateLib().then(function (pakoDeflate) {
    return pakoDeflate.gzip(input)
  })
}

function deflateFile (file) {
  return loadDeflateLib().then(function (pakoDeflate) {
    return readFile(file, 'arrayBuffer')
      .then(pakoDeflate.gzip)
      .then(function(arrayBuffer){
        var gzippedFile = new Blob([ arrayBuffer ], { type: 'application/x-gzip' })
        // add '.gz.' tag to filename
        if (file.name) {
          gzippedFile.name = file.name.replace('.','.gz.')
        }
        return gzippedFile
      })
  })
}

// helpers

function loadDeflateLib () {
  return runtime.isBrowser ? fetchScript(PAKO_LIB.deflate.url) : Promise.resolve(runtime.require(PAKO_LIB.deflate.module))
}

function loadInflateLib () {
  return runtime.isBrowser ? fetchScript(PAKO_LIB.inflate.url) : Promise.resolve(runtime.require(PAKO_LIB.inflate.module))
}