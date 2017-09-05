import test from 'ava'
import io3d from '../build/3dio'

const sceneStructure = {
  planStructure: [
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
      "hCeiling": 2.4,
    }
  ]
}

test('Staging: fails without api key', t => {
  io3d.config({
    publishableApiKey: 'd40ade73-bdeb-4fbc-aa88-b6c865214c46'
  })
  console.log
  return io3d.staging.getFurnishings(sceneStructure)
    .then(result => {
      t.fail()
    })
})