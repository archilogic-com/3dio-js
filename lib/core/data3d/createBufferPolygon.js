  'use strict';

  // dependencies

	import triangulate2d  from './triangulate2d'

	export default function (options) {

		// API

		var inputVertices = options.outline
		var holes = options.holes
		var uvx = options.uvx || 0
		var uvz = options.uvz || 0
		var y = options.y || 0
		var flipSide = !!options.flipSide

		// internals
		var i, l, iv, iuv
		var indices

		// triangulate
		if (inputVertices.length === 4 && (holes === undefined || holes.length === 0)) {
			// its a quad - no triangulation needed
			indices = [1,0,3,3,2,1]
		} else {
			// use "earcut" triangulation
			if ( holes && holes.length > 0 ) {
				// has holes
				var holeIndices = new Array(holes.length)
				for (i = 0, l = holes.length; i < l; i++) {
					holeIndices[i] = inputVertices.length / 2
					inputVertices = inputVertices.concat(holes[i])
				}
				indices = triangulate2d(inputVertices, holeIndices)
			} else {
				// has no holes
				indices = triangulate2d(inputVertices)
			}

		}

		var outputVertices = new Float32Array(indices.length * 3)
		var outputUvs = new Float32Array(indices.length * 2)

		if (flipSide) {

			for (i = 0, l = indices.length; i < l; i += 3) {
				iv = i * 3
				iuv = i * 2
				// vertices
				outputVertices[ iv ] = inputVertices[ indices[ i + 2 ] * 2 ]
				outputVertices[ iv + 1 ] = y
				outputVertices[ iv + 2 ] = inputVertices[ indices[ i + 2 ] * 2 + 1 ]
				outputVertices[ iv + 3 ] = inputVertices[ indices[ i ] * 2 ]
				outputVertices[ iv + 4 ] = y
				outputVertices[ iv + 5 ] = inputVertices[ indices[ i ] * 2 + 1 ]
				outputVertices[ iv + 6 ] = inputVertices[ indices[ i + 1 ] * 2 ]
				outputVertices[ iv + 7 ] = y
				outputVertices[ iv + 8 ] = inputVertices[ indices[ i + 1 ] * 2 + 1 ]
				// uvs
				outputUvs[ iuv ] = inputVertices[ indices[ i + 2 ] * 2 +1 ] + uvz
				outputUvs[ iuv + 1 ] = inputVertices[ indices[ i + 2 ] * 2 ] + uvx
				outputUvs[ iuv + 2 ] = inputVertices[ indices[ i ] * 2+1 ] + uvz
				outputUvs[ iuv + 3 ] = inputVertices[ indices[ i ] * 2 ] + uvx
				outputUvs[ iuv + 4 ] = inputVertices[ indices[ i + 1 ] * 2+1 ] + uvz
				outputUvs[ iuv + 5 ] = inputVertices[ indices[ i + 1 ] * 2 ] + uvx
			}

		} else {

			for (i = 0, l = indices.length; i < l; i += 3) {
				iv = i * 3
				iuv = i * 2
				// vertices
				outputVertices[ iv ] = inputVertices[ indices[ i + 2 ] * 2 ]
				outputVertices[ iv + 1 ] = y
				outputVertices[ iv + 2 ] = inputVertices[ indices[ i + 2 ] * 2 + 1 ]
				outputVertices[ iv + 3 ] = inputVertices[ indices[ i + 1 ] * 2 ]
				outputVertices[ iv + 4 ] = y
				outputVertices[ iv + 5 ] = inputVertices[ indices[ i + 1 ] * 2 + 1 ]
				outputVertices[ iv + 6 ] = inputVertices[ indices[ i ] * 2 ]
				outputVertices[ iv + 7 ] = y
				outputVertices[ iv + 8 ] = inputVertices[ indices[ i ] * 2 + 1 ]
				// uvs
				outputUvs[ iuv ] = inputVertices[ indices[ i + 2 ] * 2+1 ] + uvz
				outputUvs[ iuv + 1 ] = inputVertices[ indices[ i + 2 ] * 2 ] + uvx
				outputUvs[ iuv + 2 ] = inputVertices[ indices[ i + 1 ] * 2+1 ] + uvz
				outputUvs[ iuv + 3 ] = inputVertices[ indices[ i + 1 ] * 2 ] + uvx
				outputUvs[ iuv + 4 ] = inputVertices[ indices[ i ] * 2+1 ] + uvz
				outputUvs[ iuv + 5 ] = inputVertices[ indices[ i ] * 2 ] + uvx
			}

		}

		return {
			vertices: outputVertices,
			uvs: outputUvs
		}

	}