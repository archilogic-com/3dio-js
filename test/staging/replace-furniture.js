import replaceFurniture from '../../src/staging/replace-furniture'

// mock runtime module to prevent from tests blowing up
jest.mock('../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require}))

// replace furniture
test('Replace furniture items', async () => {
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
  const result = await replaceFurniture(sceneStructure)
  // furniture ids should have changed
  const idsChanged = result
    && copy.children[0].src !== result.children[0].src
    && copy.children[1].src !== result.children[1].src
    && copy.children[2].src !== result.children[2].src
  expect(idsChanged).toBeTruthy()
})
// replace furniture
test('Replace furniture items - invalid furnture id', async () => {
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
  try {
    await replaceFurniture(sceneStructure)
  } catch (e) {
    expect(e).toEqual('No valid furniture elements were found')
  }
})