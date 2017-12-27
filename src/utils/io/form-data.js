import runtime from '../../core/runtime.js'
// fixme: metro bundler workaround for react-native
const requireAlias = require

var FormData_
if (runtime.isNode) {
  FormData_ = requireAlias('form-data')
} else if (typeof FormData !== 'undefined') {
  FormData_ = FormData
} else {
  console.warn('Missing FormData API.')
  FormData_ = function FormDataError() {
    throw new Error('Missing FormData API.')
  }
}

export default FormData_
