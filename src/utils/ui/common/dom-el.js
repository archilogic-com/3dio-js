import runtime from '../../../core/runtime.js'

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

// utils
el.isElement = isElement

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
    } else if (key === 'click' || key === 'keydown' || key === 'keyup') {
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
  el.empty = function emptyElement () {
    while (el.lastChild) el.removeChild(el.lastChild)
    return el
  }
  el.append = function append (o) {
    if (o) isElement(o) ? el.appendChild(o) : el.innerHTML = o
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
  el.toggleSlide = function toggleSlide () {
    toggleSlideEl(el)
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

// https://stackoverflow.com/a/3797442/2835973
function getHiddenElementHeight (el) {
  var el_style = window.getComputedStyle(el),
    el_display = el_style.display,
    el_position = el_style.position,
    el_visibility = el_style.visibility,
    el_max_height = el_style.maxHeight.replace('px', '').replace('%', ''),

    wanted_height = 0;

  // if its not hidden we just return normal height
  if (el_display !== 'none' && el_max_height !== '0') {
    return el.offsetHeight;
  }

  // the element is hidden so:
  // making the el block so we can meassure its height but still be hidden
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  el.style.display = 'block';

  wanted_height = el.offsetHeight;

  // reverting to the original values
  el.style.display = el_display;
  el.style.position = el_position;
  el.style.visibility = el_visibility;

  return wanted_height;
}

// https://stackoverflow.com/a/3797442/2835973
function toggleSlideEl (el) {
  var el_max_height = 0;

  if (el.getAttribute('data-max-height')) {
    // we've already used this before, so everything is setup
    if (el.style.maxHeight.replace('px', '').replace('%', '') === '0') {
      el.style.maxHeight = el.getAttribute('data-max-height');
      el.style.opacity = 1;
    } else {
      el.style.maxHeight = 0;
      el.style.opacity = 0;
    }
  } else {
    el_max_height = getHiddenElementHeight(el) + 'px';
    //el.style['-webkit-transition'] = 'background 0.5a linear, max-height 0.5s ease-in-out';
    el.style['-webkit-transition'] = 'opacity 0.5s ease-out, max-height 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    el.style.transition = 'opacity 0.5s ease-out, max-height 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
    el.style.overflowY = 'hidden';
    el.style.maxHeight = '0';
    el.setAttribute('data-max-height', el_max_height);
    el.style.display = 'block';

    // we use setTimeout to modify maxHeight later than display (to we have the transition effect)
    setTimeout(function () {
      el.style.maxHeight = el_max_height;
      el.style.opacity = 1;
    }, 10);
  }
}