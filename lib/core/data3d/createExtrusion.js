 'use strict';

  // main

export default function (options) {

    // API

    var inputVertices = options.outline
    var y = options.y || 1
    var flipSide = !!options.flipSide
    var isOpenOutline = options.isOpenOutline || false
    var inputVerticesLength = inputVertices.length

    // side faces

    var outputVertices = new Float32Array(inputVerticesLength * 9)
    var outputUvs = new Float32Array(inputVerticesLength * 6)
    var distance

    if (flipSide) {

      if (!isOpenOutline) {

        // first side quad is special because it has to deal with first and last point

        outputVertices[0] = inputVertices[inputVerticesLength - 2]
        outputVertices[1] = 0
        outputVertices[2] = inputVertices[inputVerticesLength - 1]
        outputVertices[3] = inputVertices[inputVerticesLength - 2]
        outputVertices[4] = y
        outputVertices[5] = inputVertices[inputVerticesLength - 1]
        outputVertices[6] = inputVertices[0]
        outputVertices[7] = 0
        outputVertices[8] = inputVertices[1]
        outputVertices[9] = inputVertices[inputVerticesLength - 2]
        outputVertices[10] = y
        outputVertices[11] = inputVertices[inputVerticesLength - 1]
        outputVertices[12] = inputVertices[0]
        outputVertices[13] = y
        outputVertices[14] = inputVertices[1]
        outputVertices[15] = inputVertices[0]
        outputVertices[16] = 0
        outputVertices[17] = inputVertices[1]

        distance = distance2d(inputVertices[inputVerticesLength - 2], inputVertices[inputVerticesLength - 1], inputVertices[0], inputVertices[1])
        outputUvs[0] = 0
        outputUvs[1] = 0
        outputUvs[2] = 0
        outputUvs[3] = y
        outputUvs[4] = distance
        outputUvs[5] = 0
        outputUvs[6] = 0
        outputUvs[7] = y
        outputUvs[8] = distance
        outputUvs[9] = y
        outputUvs[10] = distance
        outputUvs[11] = 0
      }

      // other side quads
      for (var i = 2; i < inputVerticesLength; i += 2) {

        outputVertices[ i * 9 ] = inputVertices[ i - 2 ]
        outputVertices[ i * 9 + 1 ] = 0
        outputVertices[ i * 9 + 2 ] = inputVertices[ i - 1 ]
        outputVertices[ i * 9 + 3 ] = inputVertices[ i - 2 ]
        outputVertices[ i * 9 + 4 ] = y
        outputVertices[ i * 9 + 5 ] = inputVertices[ i - 1 ]
        outputVertices[ i * 9 + 6 ] = inputVertices[ i ]
        outputVertices[ i * 9 + 7 ] = 0
        outputVertices[ i * 9 + 8 ] = inputVertices[ i + 1 ]
        outputVertices[ i * 9 + 9 ] = inputVertices[ i - 2 ]
        outputVertices[ i * 9 + 10 ] = y
        outputVertices[ i * 9 + 11 ] = inputVertices[ i - 1 ]
        outputVertices[ i * 9 + 12 ] = inputVertices[ i ]
        outputVertices[ i * 9 + 13 ] = y
        outputVertices[ i * 9 + 14 ] = inputVertices[ i + 1 ]
        outputVertices[ i * 9 + 15 ] = inputVertices[ i ]
        outputVertices[ i * 9 + 16 ] = 0
        outputVertices[ i * 9 + 17 ] = inputVertices[ i + 1 ]

        distance = distance2d(inputVertices[ i - 2 ], inputVertices[ i - 1 ], inputVertices[ i ], inputVertices[ i + 1 ])
        outputUvs[ i * 6 ] = 0
        outputUvs[ i * 6 + 1 ] = 0
        outputUvs[ i * 6 + 2 ] = 0
        outputUvs[ i * 6 + 3 ] = y
        outputUvs[ i * 6 + 4 ] = distance
        outputUvs[ i * 6 + 5 ] = 0
        outputUvs[ i * 6 + 6 ] = 0
        outputUvs[ i * 6 + 7 ] = y
        outputUvs[ i * 6 + 8 ] = distance
        outputUvs[ i * 6 + 9 ] = y
        outputUvs[ i * 6 + 10 ] = distance
        outputUvs[ i * 6 + 11 ] = 0
      }

    } else {

      if (!isOpenOutline) {

        // first side quad is special because it has to deal with first and last point

        outputVertices[0] = inputVertices[inputVerticesLength - 2]
        outputVertices[1] = 0
        outputVertices[2] = inputVertices[inputVerticesLength - 1]
        outputVertices[3] = inputVertices[0]
        outputVertices[4] = 0
        outputVertices[5] = inputVertices[1]
        outputVertices[6] = inputVertices[inputVerticesLength - 2]
        outputVertices[7] = y
        outputVertices[8] = inputVertices[inputVerticesLength - 1]
        outputVertices[9] = inputVertices[inputVerticesLength - 2]
        outputVertices[10] = y
        outputVertices[11] = inputVertices[inputVerticesLength - 1]
        outputVertices[12] = inputVertices[0]
        outputVertices[13] = 0
        outputVertices[14] = inputVertices[1]
        outputVertices[15] = inputVertices[0]
        outputVertices[16] = y
        outputVertices[17] = inputVertices[1]

        distance = distance2d(inputVertices[inputVerticesLength - 2], inputVertices[inputVerticesLength - 1], inputVertices[0], inputVertices[1])
        outputUvs[0] = 0
        outputUvs[1] = 0
        outputUvs[2] = distance
        outputUvs[3] = 0
        outputUvs[4] = 0
        outputUvs[5] = y
        outputUvs[6] = 0
        outputUvs[7] = y
        outputUvs[8] = distance
        outputUvs[9] = 0
        outputUvs[10] = distance
        outputUvs[11] = y

      }

      // other side quads
      for (var i = 2; i < inputVerticesLength; i += 2) {

        outputVertices[ i * 9 ] = inputVertices[ i - 2 ]
        outputVertices[ i * 9 + 1 ] = 0
        outputVertices[ i * 9 + 2 ] = inputVertices[ i - 1 ]
        outputVertices[ i * 9 + 3 ] = inputVertices[ i ]
        outputVertices[ i * 9 + 4 ] = 0
        outputVertices[ i * 9 + 5 ] = inputVertices[ i + 1 ]
        outputVertices[ i * 9 + 6 ] = inputVertices[ i - 2 ]
        outputVertices[ i * 9 + 7 ] = y
        outputVertices[ i * 9 + 8 ] = inputVertices[ i - 1 ]
        outputVertices[ i * 9 + 9 ] = inputVertices[ i - 2 ]
        outputVertices[ i * 9 + 10 ] = y
        outputVertices[ i * 9 + 11 ] = inputVertices[ i - 1 ]
        outputVertices[ i * 9 + 12 ] = inputVertices[ i ]
        outputVertices[ i * 9 + 13 ] = 0
        outputVertices[ i * 9 + 14 ] = inputVertices[ i + 1 ]
        outputVertices[ i * 9 + 15 ] = inputVertices[ i ]
        outputVertices[ i * 9 + 16 ] = y
        outputVertices[ i * 9 + 17 ] = inputVertices[ i + 1 ]

        distance = distance2d(inputVertices[ i - 2 ], inputVertices[ i - 1 ], inputVertices[ i ], inputVertices[ i + 1 ])
        outputUvs[ i * 6 ] = 0
        outputUvs[ i * 6 + 1 ] = 0
        outputUvs[ i * 6 + 2 ] = distance
        outputUvs[ i * 6 + 3 ] = 0
        outputUvs[ i * 6 + 4 ] = 0
        outputUvs[ i * 6 + 5 ] = y
        outputUvs[ i * 6 + 6 ] = 0
        outputUvs[ i * 6 + 7 ] = y
        outputUvs[ i * 6 + 8 ] = distance
        outputUvs[ i * 6 + 9 ] = 0
        outputUvs[ i * 6 + 10 ] = distance
        outputUvs[ i * 6 + 11 ] = y

      }

    }

    return {
      vertices: outputVertices,
      uvs: outputUvs
    }

  }

  // helpers

  function distance2d (p1x, p1y, p2x, p2y) {
    return Math.sqrt((p2x - p1x) * (p2x - p1x) + (p2y - p1y) * (p2y - p1y))
  }
