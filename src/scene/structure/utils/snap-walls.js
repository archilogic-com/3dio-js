export default function snapWalls(walls) {

  // config
  var maxWallWidth = 0.4
  var minWallDimRatio = 1.2

  // find all walls in level
  var wallData = []
  var snappedWalls = []

  // compute points and vectors for each wall
  for (var i = 0; i < walls.length; i++) {
    wallData.push({
      wall: walls[i],
      data: getWallData(walls[i])
    })
  }

  var basePoint, endPoint, connectedWalls = 0
  var maxDistance = 0.2, isWithinMaxDistance = false

  // main loop to cycle through all walls and do the snapping
  for (var i = 0; i < wallData.length; i++) {

    // get maximum snapping distance from wall width
    maxDistance = wallData[i].wall.w <= 0.5 ? wallData[i].wall.w : 0.2//* 0.5
    // avoid to short walls
    if ((wallData[i].wall.l / wallData[i].wall.w) < minWallDimRatio) continue
    // avoid weird snapping with thick walls
    if (wallData[i].wall.w >= maxWallWidth) continue
    // map wall 1 end points
    basePoint = wallData[i].data.p1
    endPoint = wallData[i].data.p2

    // find walls to snap with
    for (var j = i + 1; j < wallData.length; j++) {
      // avoid weird snapping with thick walls
      if (wallData[j].wall.w >= maxWallWidth) continue
      // skip same wall
      if (i === j) continue

      if (distance(basePoint, wallData[j].data.p1) <= maxDistance) isWithinMaxDistance = true
      else if (distance(basePoint, wallData[j].data.p2) <= maxDistance) isWithinMaxDistance = true
      else if (distance(endPoint, wallData[j].data.p1) <= maxDistance) isWithinMaxDistance = true
      else if (distance(endPoint, wallData[j].data.p2) <= maxDistance) isWithinMaxDistance = true

      if (isWithinMaxDistance) {
        // do the wall snapping
        snappedWalls = connectWall(wallData[i], wallData[j])
        // update the computed wall data
        wallData[i].wall = snappedWalls ? snappedWalls[0] : wallData[i].wall
        wallData[j].wall = snappedWalls ? snappedWalls[1] : wallData[j].wall

        wallData[i].data = getWallData(wallData[i].wall)
        wallData[j].data = getWallData(wallData[j].wall)
        connectedWalls += 1
      }
      isWithinMaxDistance = false
    }
  }

  // get snapped walls
  snappedWalls = []
  for (var i = 0; i < wallData.length; i++) {
    snappedWalls.push(wallData[i].wall)
  }

  return snappedWalls

  function connectWall (firstWall, secondWall) {

    // get Walls
    var walls = [firstWall.wall, secondWall.wall]
    var data = [firstWall.data, secondWall.data]

    var angle0 = walls[0].ry <= 180 ? walls[0].ry : walls[0].ry - 180,
      angle1 = walls[1].ry <= 180 ? walls[1].ry : walls[1].ry - 180,
      angleDiff = Math.abs(parseInt(angle0) - parseInt(angle1))

    // stop for quasi parallel walls
    if (angleDiff < 1) return

    var count = 2

    // map points and vectors
    var p1 = [data[0].p1, data[1].p1],
      p2 = [data[0].p2, data[1].p2],
      p3 = [data[0].p3, data[1].p3],
      p4 = [data[0].p4, data[1].p4],
      v = [data[0].v, data[1].v],
      u = [],
      w = [data[0].w, data[1].w]

    var pA, pB0, pB0S, pB1, pB1S, pC, pC0, pC1, dA1, dA2, dA = [], dC = [], base = [], pBase = [], pSnap, far = []
    var alpha, beta, i

    // compute Intersection candidates

    // Base Line Intersection
    pA = intersection(p1[0], p2[0], p1[1], p2[1])

    // Basel Line 0, Support Line 1 Intersection
    pB0 = intersection(p1[0], p2[0], p3[1], p4[1])
    // projection to wall 1
    pB0S = subtract(pB0, w[1])
    // Support Line 0, Basel Line 1 Intersection
    pB1 = intersection(p3[0], p4[0], p1[1], p2[1])
    // projection to wall 0
    pB1S = subtract(pB1, w[0])
    // Support Line Intersection
    pC = intersection(p3[0], p4[0], p3[1], p4[1])
    pC0 = subtract(pC, w[0])
    pC1 = subtract(pC, w[1])

    for (i = 0; i < count; i++) {

      dA1 = distance(p1[i], pA)
      dA2 = distance(p2[i], pA)

      // check if base point is next to intersection or opposite
      if (dA2 > dA1) {
        dA[i] = dA2
        pBase[i] = {
          x: p2[i].x,
          z: p2[i].z
        }
        // base point is next to intersection
        base[i] = false
        far[i] = dA1 > 20
      } else {
        dA[i] = dA1
        pBase[i] = {
          x: p1[i].x,
          z: p1[i].z
        }
        // base point is opposite to intersection
        base[i] = true
        far[i] = dA2 > 20
      }

      u[i] = {
        x: (pBase[i].x - pA.x) / dA[i],
        z: (pBase[i].z - pA.z) / dA[i]
      }
      dC[i] = i < 1 ? distance(pBase[i], pC0) : distance(pBase[i], pC1)
    }

    if (far[0] && far[1]) {
      console.log('intersection too far away')
      return
    }

    // relative angle between wall vectors
    alpha = angle(v[0], v[1])
    // relative angle between direction corrected wall vectors
    beta = angle(u[0], u[1])

    if (beta < 10) {
      console.log('angle too small')
      return
    }

    //if (singleConnect) count = 1

    for (i = 0; i < count; i++) {
      // choose proper intersection points
      if (Math.round(alpha) >= 88 && Math.round(alpha) <= 92) {

        // choose intersection by base point orientation
        if (base[0] === base[1]) {
          if (dC[0] < dA[0]) {
            if (alpha > 90) {
              pSnap = i < 1 ? pB0 : pC1
            } else {
              pSnap = i < 1 ? pC0 : pC1
            }
          } else {
            if (alpha > 90) {
              pSnap = i < 1 ? pB1S : pA
            } else {
              pSnap = pA
            }
          }
        }
        else {
          if (dC[0] < dA[0]) {
            pSnap = i < 1 ? pB0 : pB0S
          } else {
            pSnap = i < 1 ? pB1S : pB1
          }
        }
      }
      else if (alpha < 90) {
        if (beta <= 90) {
          pSnap = pA
        } else if (dC[0] < dA[0]) {
          pSnap = pA
        } else if (dC[0] > dA[0]) {
          pSnap = i < 1 ? pC0 : pC1
        }
      } else {
        if (beta <= 90) {
          pSnap = i < 1 ? pB0 : pB0S
        } else if (dC[0] < dA[0]) {
          pSnap = i < 1 ? pB1S : pB1
        } else if (dC[0] > dA[0]) {
          pSnap = i < 1 ? pB0 : pB0S
        }

      }

      var oldLength = walls[i].l
      if (!pSnap) {
        console.log('pSnap failed')
        return
      }
      var newLength = distance(pBase[i], pSnap)

      // check and prevent irregular wall length changes
      if (Math.abs(newLength - oldLength) > 0.5) {
        console.log('delta', rnd(newLength - oldLength), 'new', rnd(newLength), 'old', rnd(oldLength))
        return
      }

      // if basePoint is opposite to intersection adjust length
      if (base[i]) {
        walls[i].l = newLength

        // if basePoint is next to intersection adjust length and shift wall
      } else {
        walls[i].x = pSnap.x
        walls[i].z = pSnap.z
        walls[i].l = newLength
        var c = walls[i].children

        if (c.length > 0) {
          for (var t = 0; t < c.length; t++) {
            var newPos = c[t].x - oldLength + newLength
            c[t].x = newPos
          }
        }
      }

    }
    return walls
  }

  ////////////////
  // helpers
  ////////////////

  // get wall points
  function getWallData (wall) {
    var wallAngle, p1, p2, p3, p4, v, w
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
      },
      // Support Line Points
      p3 = {
        x: wall.x + w.x,
        z: wall.z + w.z
      },
      p4 = {
        x: p2.x + w.x,
        z: p2.z + w.z
      },
      // normalized wall vector
      v = {
        x: (p2.x - p1.x) / wall.l,
        z: (p2.z - p1.z) / wall.l
      }
    return {wallAngle: wallAngle, p1: p1, p2: p2, w: w, p3: p3, p4: p4, v: v}
  }

  // angle between vector v and u
  function angle (v, u) {
    return Math.round(((Math.acos(v.x * u.x + v.z * u.z)) * 180 / Math.PI) * 10) / 10
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

  // subtract two vectors
  function subtract (p, q) {
    return {x: p.x - q.x, z: p.z - q.z}
  }

  function rnd (a) {
    return Math.round(a * 100) / 100
  }
}