import runtime from '../../core/runtime.js'

var el = {}

el.add = function addElement (type, attrs) {
  runtime.assertBrowser()

  var el = document.createElement(type)

  if (attrs) Object.keys(attrs).forEach(function (key) {
    if (key === 'text') {
      // text
      el.appendChild(document.createTextNode(attrs.text))
    } else if (key === 'html') {
      // html
      el.innerHTML = attrs.html
    } else if (key === 'click' || key === 'keyup') {
      // events
      el.addEventListener(key, attrs[key])
    } else {
      // any other attributes
      el.setAttribute(key, attrs[key])
    }
  })

  el.remove = function removeElement (child) {
    child ? el.removeChild(child) : el.parentNode.removeChild(el)
    return el
  }
  el.appendTo = function appendToElement (parentEl) {
    parentEl === 'body' ? document.body.appendChild(el) : parentEl.appendChild(el)
    return el
  }
  el.prependTo = function prependToElement (parentEl) {
    parentEl === 'body' ? document.body.prepend(el) : parentEl.prepend(el)
    return el
  }
  el.val = function handleValue (str) {
    str ? el.setAttribute('value', str) : null
    return el.value
  }
  el.addClass = function addCssClass (str) {
    el.classList.add(str)
    return el
  }
  el.removeClass = function removeCssClass (str) {
    el.classList.remove(str)
    return el
  }
  el.hide = function hideElement () {
    el.___originalStyleDisplay = el.style.display
    el.style.display = 'none'
    return el
  }
  el.show = function showElement () {
    el.style.display = el.___originalStyleDisplay && el.___originalStyleDisplay !== '' ? el.___originalStyleDisplay : 'block'
    return el
  }

  return el
}

export default el