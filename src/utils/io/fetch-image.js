import Promise from 'bluebird'
import runtime from '../../core/runtime.js'

export default function fetchImage (url) {
	return new Promise(function (resolve, reject) {

		var img = document.createElement('img')
		img.crossOrigin = 'Anonymous'

		img.onload = function () {
			resolve(img)
		}

		var triedWithCacheBust = false
		img.onerror = function () {
			if(triedWithCacheBust) {
				reject('Error loading image ' + url)
			} else {
				// try again with cache busting to avoid things like #1510
				triedWithCacheBust = true
				img.src = ( url.indexOf('?') > -1 ? '&' : '&' ) + 'cacheBust=' + new Date().getTime()
			}
		}

		// initiate image loading
		img.src = url

	})
}