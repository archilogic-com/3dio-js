import runtime from '../../core/runtime.js'

var FormData_
if (runtime.isNode) {
  // FIXME: use require alias after #126 is resolved
  //FormData_ = runtime.require('form-data')
  FormData_ = require('form-data')
} else if (typeof FormData !== 'undefined') {
  FormData_ = FormData
} else {
  console.warn('Missing FormData API.')
  FormData_ = function FormDataError() {
    throw new Error('Missing FormData API.')
  }
}

export default FormData_
