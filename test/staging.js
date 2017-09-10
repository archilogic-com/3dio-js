import test from 'ava'
import io3d from '../build/3dio'

// staging

// TODO: make tests work with publishableApiKey ( set Origin: localhost )
test('Staging: fails without api key', t => {
  const sceneStructure = [
    {
      "type": "wall",
      "x": -4.137886187888139,
      "z": -2.6663291723560394,
      "l": 8.634715981486028,
      "ry": 360,
      "children": [],
      "id": "ce45f8e2-c7a8-413f-a26f-224a6921385c",
      "y": 0,
      "w": 0.15,
      "h": 2.4
    },
    {
      "type": "wall",
      "x": 4.49682979359789,
      "z": -2.5163291723560373,
      "l": 8.093281490772197,
      "ry": 270,
      "children": [],
      "id": "18b31435-2fbe-4ba9-8168-d05586a11bcc",
      "y": 0,
      "w": 0.15,
      "h": 2.4
    },
    {
      "type": "wall",
      "x": 4.346829793597887,
      "z": 5.5769523184161605,
      "l": 8.46342675212081,
      "ry": 180,
      "children": [],
      "id": "eee6715b-45c0-44ea-927b-47e09c617f3d",
      "y": 0,
      "w": 0.15,
      "h": 2.4
    },
    {
      "type": "wall",
      "x": -4.116596958522924,
      "z": 5.426952318416159,
      "l": 7.9433100199432705,
      "ry": 90.15,
      "children": [],
      "id": "239e865e-9798-4730-9190-1ee1c3eaceec",
      "y": 0,
      "w": 0.15,
      "h": 2.4
    },
    {
      "type": "polyfloor",
      "x": 0.18491563238389944,
      "z": 1.4536578433037646,
      "polygon": [
        [
          -4.151504596472756,
          3.973286975112397
        ],
        [
          4.161906661213991,
          3.973286975112396
        ],
        [
          4.16190666121399,
          -3.969979515659804
        ],
        [
          -4.1723000670268435,
          -3.969979515659804
        ],
        [
          -4.151504596472756,
          3.973286975112397
        ]
      ],
      "children": [],
      "id": "7b74df23-b23e-4984-b301-d148eb06e76c",
      "y": 0,
      "ry": 0,
      "h": 0.2,
      "hasCeiling": true,
      "hCeiling": 2.4
    }
  ]
  io3d.config({
    servicesUrl: 'https://testing.archilogic.com/api/v2',
    publishableApiKey: '213edd35-0500-4953-bbc1-b4d7535d604f'
  })
  return io3d.staging.getFurnishings(sceneStructure)
    .then(result => {
      t.true(result.length > 0 && (result[0].type === 'group' || result[0].type === 'interior'))
    })
})

// replace furniture
test('Replace furniture items', t => {
  const sceneStructure = {
    "ry": 179.62838449473506,
    "src": "!5513b403-87eb-4243-8b5a-cc5cc29c617e",
    "x": 0.7949918920618211,
    "y": 0,
    "z": -1.8649088524300308,
    "type": "group",
    "children": [{
      "type": "interior",
      "src": "!f12093e6-02d7-4a7f-9fb1-01f0073f7c5f",
      "children": [],
      "x": 0,
      "y": 0,
      "z": 0,
      "ry": 0,
      "id": "04d5fc68-eb0c-464a-9b0c-ad428e8d867a"
    }, {
      "type": "interior",
      "src": "!8b5f7079-b42b-4689-9b37-3dd2946bb651",
      "z": 1.25,
      "children": [],
      "x": 0,
      "y": 0,
      "ry": 0,
      "id": "29ea48cc-b7f6-4ae6-bfb1-7c53854da5c8"
    }, {
      "type": "interior",
      "src": "!b74d75f4-a228-4145-948c-d30ce69042dc",
      "z": 0.010000000000000009,
      "x": 1.58,
      "ry": 180,
      "children": [],
      "y": 0,
      "id": "e7cbe45a-8179-4ec3-9d78-7f587f671f70"
    }],
    "id": "c3c800d4-b88b-4328-a79e-04c881cc4fb9"
  }
  // create copy to test against later
  var copy = JSON.parse(JSON.stringify(sceneStructure))
  return io3d.staging.replaceFurniture(sceneStructure)
    .then(result => {
      // furniture ids should have changed
      console.log(result.children[0].src, result.children[1].src, result.children[2].src)
      t.true(result
        && copy.children[0].src !== result.children[0].src
        && copy.children[1].src !== result.children[1].src
        && copy.children[2].src !== result.children[2].src)
    })
})
// replace furniture
test('Replace furniture items - invalid furnture id', t => {
  const sceneStructure = {
    "type": "interior",
    "src": 12,
    "children": [],
    "x": 0,
    "y": 0,
    "z": 0,
    "ry": 0,
    "id": "04d5fc68-eb0c-464a-9b0c-ad428e8d867a"
  }
  // create copy to test against later
  return io3d.staging.replaceFurniture(sceneStructure)
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      t.is(error, 'No valid furniture elements were found')
    })
})
