import createConfirmUi from './create-confirm-ui.js'
import el from './common/dom-el.js'
import runtime from '../core/runtime.js'

// main

export default function createAlertUi (a, b) {
  runtime.assertBrowser()

  if (el.isElement(a) || typeof a === 'string') {
    b = b || {}
    b.closeButton = false
    b.cancelButton = false
    b.confirmButton = true
  } else if (typeof a === 'object') {
    a.closeButton = false
    a.cancelButton = false
    a.confirmButton = true
  } else {
    throw 'Argument mismatch https://3d.io/docs/api/1/ui.html'
  }
  
  return createConfirmUi(a, b)
}