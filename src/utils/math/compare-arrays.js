export default function compareArrays(a, b, precision) {

	if (a === b) {
		return true
	} else if (a.length !== b.length) {
		return false
	} else {
		precision = precision === undefined ? 1 : precision
		var step = ~~(a.length / (a.length * precision))
		for (var i = 0, l = a.length; i<l; i+=step) if (a[i] !== b[i]) return false
		return true
	}

}