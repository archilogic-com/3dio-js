var
  FALLBACK_MIME_TYPE = 'application/octet-stream',
  EXTENSION_TO_MIME_TYPE = {
    obj: 'text/plain',
    dds: 'application/octet-stream',
    dwg: 'application/acad',
    dxf: 'application/dxf',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
    log: 'text/plain',
    svg: 'svg+xml',
    html: 'text/html',
    htm: 'text/html',
    js: 'application/javascript',
    json: 'application/json',
    md: 'text/markdown',
    csv: 'text/csv',
    gz:	'application/x-gzip',
    gzip:	'application/x-gzip',
    zip:'application/x-zip',
    pdf: 'application/pdf',
    '3ds': 'application/x-3ds'
  }

export default function getMimeTypeFromFileName (filename) {
  var
    result = FALLBACK_MIME_TYPE,
    extension

  // get extension if file has one
  if (filename.indexOf('.') > -1) {
    extension = filename.split('.').pop().toLowerCase()
    if (EXTENSION_TO_MIME_TYPE[extension]) {
      // set mime type if it exists in the map
      result = EXTENSION_TO_MIME_TYPE[extension]
    }
  }

  return result
}