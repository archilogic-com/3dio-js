import { 
  normalizeInput,
  getSceneStructureFromFurnishingResult,
  getFurnitureGroupData 
} from '../../src/staging/get-furnishings'

// mock runtime module to prevent from tests blowing up
jest.mock('../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require}))

test('normalize sceneStructure input for home staging', async () => {
  const sceneStructure = [{
    type: 'wall',
    l: 2
  }]
  const _sceneStructure = await normalizeInput(sceneStructure)
  expect(_sceneStructure.type).toBe('plan')
  const level = _sceneStructure.children[0]
  expect(level.type).toBe('level')
  expect(level.children[0].type).toBe('wall')
})

test('getFurnitureGroupData', async () => {
  const group = {
    "src": "!d2d088b2-c4cc-4116-899f-a16886ef1fba",
    "ry": 24.26999894978845,
    "z": -8.694577607293752,
    "y": 0.0,
    "x": -0.45541461074724876
  }
  const result = await getFurnitureGroupData(group)
  expect(result.children.length).toBeGreaterThan(1)
})

const homeStagingResponse = {
  "furnishings": {
    "201df77b-eda4-47f3-967c-cbf0cd34336a": [{
      "groups": [{
        "src": "!d2d088b2-c4cc-4116-899f-a16886ef1fba",
        "ry": 24.26999894978845,
        "z": -8.694577607293752,
        "y": 0.0,
        "x": -0.45541461074724876
      }, {
        "src": "!fd78c5a5-f04e-4a25-9b3c-302737eeceaa",
        "ry": -39.35175262626473,
        "z": -4.289,
        "y": 0.0,
        "x": 0.451
      }, {
        "src": "!6db0ff0f-89f2-4e77-b587-2276bdf6db5f",
        "ry": 118.86000000000001,
        "z": -7.139364495691506,
        "y": 0.0,
        "x": -3.2812095686708287
      }, {
        "src": "!28ef0716-5a1d-4dbd-8ce2-f4a7cafc32cb",
        "ry": -93.63999685456771,
        "z": -6.776799926358696,
        "y": 0.0,
        "x": 3.1621674076807014
      }, {
        "src": "!02bb9b24-3265-4578-bdb1-355961ea7002",
        "ry": -93.63999685456771,
        "z": -9.371554823253685,
        "y": 0.0,
        "x": 3.3272341367313207
      }],
      "metaData": {
        "tags": ["generic", "sofa", "sofa_4p", "table", "table_8p"],
        "wallLengths": [3.44, 2.2, 2.2, 1.71],
        "dominantGroupName": "GenericSofaArmchairGroup3066",
        "function": "dining_living",
        "relations": [],
        "name": "GenericSofaArmchairGroup3066_GenericDining8_GenericShelfSmall_GenericShelfLarge_GenericArmchairCoffeeTable23130",
        "minArea": 29.6,
        "style": "generic",
        "yMax": 2.3
      }
    }]
  },
  "errors": {}
}

test('getSceneStructureFromFurnishingResult', async () => {
  const result = await getSceneStructureFromFurnishingResult(homeStagingResponse)
  expect(result.length).toBe(5)
  expect(result[0].type).toBe('group')
  expect(result[0].children[0].type).toBe('interior')
})