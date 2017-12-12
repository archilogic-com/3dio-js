function getElement3d (el, center) {
  let data = el.getAttribute('line-element')
  delete data.color
  let pos = el.getAttribute('position')
  let rot = el.getAttribute('rotation')
  data.x = round(pos.x)
  data.y = round(pos.y)
  data.z = round(pos.z)
  data.ry = round(rot.y)
  // clean up data
  if (data.type === 'wall') {
    var w = {
      x: -data.w * Math.cos(data.ry * Math.PI / 180 + Math.PI / 2),
      z: data.w * Math.sin(data.ry * Math.PI / 180 + Math.PI / 2)
    }
    if (!center) {
      data.x -= w.x / 2
      data.z -= w.z / 2
    }
    data.h = 2.4
    data.y = 0
  } else if (data.type === 'door') {
    data.h = 2
    data.y = 0
  } else if (data.type === 'window') {
    data.h = 1.2
    data.y = 0.8
  }
  return data
}

// get wall points + vectors
function getWallData (wall) {
  var
    wallAngle = wall.ry / 180 * Math.PI,
    // width vector
    w = {
      x: -wall.w * Math.cos(wallAngle + Math.PI / 2),
      z: wall.w * Math.sin(wallAngle + Math.PI / 2)
    },
    // Base Line Points
    p1 = {
      x: wall.x,
      z: wall.z
    },
    p2 = {
      x: wall.x + wall.l * Math.cos(wallAngle),
      z: wall.z - wall.l * Math.sin(wallAngle)
    }
  return {wallAngle: wallAngle, p1: p1, p2: p2, w: w}
}

function pointOnWall (p, wall, snapToPoint) {
  const data = getWallData(wall)
  // get intersection point
  const _p = intersection(p, {x: p.x + data.w.x, z: p.z + data.w.z}, data.p1, data.p2)
  // see if intersection is on the wall
  const d1 = distance(_p, data.p1)
  const d2 = distance(_p, data.p2)
  const dl = distance(data.p1, data.p2)
  // return closest wall point if asked for
  if (snapToPoint) {
    return (d1 > d2) ? data.p2 : data.p1
  }
  else if (d1 > dl) return data.p2
  else if (d2 > dl) return data.p1
  else return _p
}

function getPolygonArea(polygon) {
  var numPoints = polygon.length
  var area = 0         // Accumulates area in the loop
  var j = numPoints - 1  // The last vertex is the 'previous' one to the first
  for (var i = 0; i < numPoints; i++) {
    area = area + (polygon[ j ][ 0 ] + polygon[ i ][ 0 ]) * (polygon[ j ][ 1 ] - polygon[ i ][ 1 ])
    j = i  //j is previous vertex to i
  }
  area = Math.round(Math.abs(area / 2)*100)/100
  return area
}

// intersections line p and q
function intersection (p1, p2, q1, q2) {
  return {
    x: ((q2.x - q1.x) * (p2.x * p1.z - p1.x * p2.z) - (p2.x - p1.x) * (q2.x * q1.z - q1.x * q2.z)) / ((q2.z - q1.z) * (p2.x - p1.x) - (p2.z - p1.z) * (q2.x - q1.x)),
    z: ((p1.z - p2.z) * (q2.x * q1.z - q1.x * q2.z) - (q1.z - q2.z) * (p2.x * p1.z - p1.x * p2.z)) / ((q2.z - q1.z) * (p2.x - p1.x) - (p2.z - p1.z) * (q2.x - q1.x)),
  }
}

// distance between points
function distance (p, q) {
  return Math.sqrt(Math.pow((p.x - q.x), 2) + Math.pow((p.z - q.z), 2))
}

function rnd (a) {
  return Math.round(a * 100) / 100
}