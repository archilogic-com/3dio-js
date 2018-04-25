var DEBUG = false

// methods

function flat (v) {
  // calculate normals for flat shading
  var n = new Float32Array(v.length)
  var i, l, crx, cry, crz, invScalar
  var hasFaultyTrigons = false
  for (i = 0, l = v.length; i < l; i += 9) {
    // cross product (a-b) x (c-b)
    crx = (v[i + 7] - v[i + 4]) * (v[i + 2] - v[i + 5]) - (v[i + 8] - v[i + 5]) * (v[i + 1] - v[i + 4])
    cry = (v[i + 8] - v[i + 5]) * (v[i] - v[i + 3]) - (v[i + 6] - v[i + 3]) * (v[i + 2] - v[i + 5])
    crz = (v[i + 6] - v[i + 3]) * (v[i + 1] - v[i + 4]) - (v[i + 7] - v[i + 4]) * (v[i] - v[i + 3])
    // normalize
    invScalar = 1 / Math.sqrt(crx * crx + cry * cry + crz * crz)
    // Fallback for trigons that don't span an area
    if (invScalar === Infinity) {
      invScalar = 0
      hasFaultyTrigons = true
    }
    // set normals
    n[i] = n[i + 3] = n[i + 6] = crx * invScalar
    n[i + 1] = n[i + 4] = n[i + 7] = cry * invScalar
    n[i + 2] = n[i + 5] = n[i + 8] = crz * invScalar

  }
  if (DEBUG && hasFaultyTrigons) console.error('Geometry contains trigons that don\'t span an area.')
  return n
}
flat.title = 'Flat'

function smooth (v) {

  // output

  var normals = new Float32Array(v.length)

  // internals

  var hash, hashes = [], vertexRelatedNormals = {}, faceNormals, averageNormal
  var n
  var crx, cry, crz, invScalar
  var hasFaultyTrigons = false
  var i, l, i2, l2

  ////////// 1. connect vertices to faces

  // go face by face
  for (i = 0, l = v.length; i < l; i += 9) {

    // calculate face normal
    // cross product (a-b) x (c-b)
    crx = (v[i + 7] - v[i + 4]) * (v[i + 2] - v[i + 5]) - (v[i + 8] - v[i + 5]) * (v[i + 1] - v[i + 4])
    cry = (v[i + 8] - v[i + 5]) * (v[i] - v[i + 3]) - (v[i + 6] - v[i + 3]) * (v[i + 2] - v[i + 5])
    crz = (v[i + 6] - v[i + 3]) * (v[i + 1] - v[i + 4]) - (v[i + 7] - v[i + 4]) * (v[i] - v[i + 3])
    // normalize
    invScalar = 1 / Math.sqrt(crx * crx + cry * cry + crz * crz)
    if (invScalar === Infinity) {
      hasFaultyTrigons = true
      invScalar = 0
    }
    // set normals
    n = [crx * invScalar, cry * invScalar, crz * invScalar]

    for (i2 = 0, l2 = 9; i2 < l2; i2 += 3) {
      hash = v[i + i2] + '_' + v[i + i2 + 1] + '_' + v[i + i2 + 2]
      if (!vertexRelatedNormals[hash]) {
        vertexRelatedNormals[hash] = {
          faceNormals: [n]
        }
        hashes[hashes.length] = hash
      } else {
        vertexRelatedNormals[hash].faceNormals.push(n)
      }
    }
  }

  ////////// 2. calculate average normals from related face normals

  var avx, avy, avz
  for (i = 0, l = hashes.length; i < l; i++) {
    hash = hashes[i]
    faceNormals = vertexRelatedNormals[hash].faceNormals
    avx = 0
    avy = 0
    avz = 0
    for (i2 = 0, l2 = faceNormals.length; i2 < l2; i2++) {
      avx += faceNormals[i2][0]
      avy += faceNormals[i2][1]
      avz += faceNormals[i2][2]
    }
    // normalize
    invScalar = 1 / Math.sqrt(avx * avx + avy * avy + avz * avz)
    if (invScalar === Infinity) {
      hasFaultyTrigons = true
      invScalar = 0
    }
    // set average normal
    vertexRelatedNormals[hash].averageNormal = [avx * invScalar, avy * invScalar, avz * invScalar]
  }

  ////////// 3. apply average normals to vertices

  for (i = 0, l = v.length; i < l; i += 3) {
    hash = v[i] + '_' + v[i + 1] + '_' + v[i + 2]
    averageNormal = vertexRelatedNormals[hash].averageNormal
    normals[i] = averageNormal[0]
    normals[i + 1] = averageNormal[1]
    normals[i + 2] = averageNormal[2]
  }

  // return
  if (DEBUG && hasFaultyTrigons) console.error('Shade Smooth: Geometry contains trigons that don\'t span an area.')
  return normals

}
smooth.title = 'Smooth'

// API

var getNormalsBuffer = {
  flat: flat,
  smooth: smooth,
}

export default getNormalsBuffer
