import runtime from '../../core/runtime.js'

// basic element utils for convenience inspired by jquery API

var elementStringRegex = /^<(\S+)>$/i

// main

var el = function (x, attributes) {
  runtime.assertBrowser()

  if (x) {
    if (typeof x === 'string') {
      // create element
      var tagSearch = elementStringRegex.exec(x)
      var tag = tagSearch ? tagSearch[1] : null
      if (tag) {
        return addElement(tag, attributes)
      } else {
        throw 'Only basic tags like "<div>" without attributes are currently supported. (No queries and no HTML strings)'
      }
    } else if (isElement(x)) {
      // only add convenience methods
      extendWithConvenienceMethods(x)
    } else {
      throw 'Please provide html element string (i.e. "<div>") or element object as first argument.'
    }
  }
}

export default el

// helpers

function addElement (type, attrs) {
  runtime.assertBrowser()

  // create element
  var el = document.createElement(type)

  // add attributes
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

  extendWithConvenienceMethods(el)

  return el
}

function extendWithConvenienceMethods (el) {
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
}

// Returns true if it is a DOM element
// https://stackoverflow.com/a/384380/2835973
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}