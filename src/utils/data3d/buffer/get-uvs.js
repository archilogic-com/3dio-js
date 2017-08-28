// methods

function projectAxisY( v ) {

  var uvs = new Float32Array(v.length/1.5)
  var uvPos = 0

  var i, l
  for (i = 0, l = v.length; i < l; i += 9) {

    uvs[ uvPos ] = v[ i + 2 ]
    uvs[ uvPos + 1 ] = v[ i ]
    uvs[ uvPos + 2 ] = v[ i + 5 ]
    uvs[ uvPos + 3 ] = v[ i + 3 ]
    uvs[ uvPos + 4 ] = v[ i + 8 ]
    uvs[ uvPos + 5 ] = v[ i + 6 ]
    uvPos += 6

  }

  return uvs

}
projectAxisY.title = 'Project Top Down'


function architectural ( v ) {

  var uvs = new Float32Array(v.length/1.5)
  var uvPos = 0

  var i, l, n, components
  for (i = 0, l = v.length; i < l; i += 9) {

    // calculate face normal
    // cross product (a-b) x (c-b)
    n = [
      (v[ i + 7 ] - v[ i + 4 ]) * (v[ i + 2 ] - v[ i + 5 ]) - (v[ i + 8 ] - v[ i + 5 ]) * (v[ i + 1 ] - v[ i + 4 ]),
      (v[ i + 8 ] - v[ i + 5 ]) * (v[ i ] - v[ i + 3 ]) - (v[ i + 6 ] - v[ i + 3 ]) * (v[ i + 2 ] - v[ i + 5 ]),
      (v[ i + 6 ] - v[ i + 3 ]) * (v[ i + 1 ] - v[ i + 4 ]) - (v[ i + 7 ] - v[ i + 4 ]) * (v[ i ] - v[ i + 3 ])
    ]

    // normals should be absolute
    if (n[0] < 0) {
      n[0] *= -1
    }
    if (n[1] < 0) {
      n[1] *= -1
    }
    if (n[2] < 0) {
      n[2] *= -1
    }

    // highest first?
    components = [ 1, 0, 2 ].sort(function(a, b) {
      return n[a] - n[b]
    })

    uvs[ uvPos ] = v[ i + components[1] ]
    uvs[ uvPos + 1 ] = v[ i + components[0] ]
    uvs[ uvPos + 2 ] = v[ i + 3 + components[1] ]
    uvs[ uvPos + 3 ] = v[ i + 3 + components[0] ]
    uvs[ uvPos + 4 ] = v[ i + 6 + components[1] ]
    uvs[ uvPos + 5 ] = v[ i + 6 + components[0] ]
    uvPos += 6

  }

  return uvs

}
architectural.title = 'Architectural'

// API

var getUvs = {
  architectural: architectural,
  projectAxisY: projectAxisY
}

export default getUvs
