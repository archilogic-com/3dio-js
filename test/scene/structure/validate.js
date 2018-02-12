import validate from '../../../src/scene/structure/validate.js';

// sceneStructure validation

test('Scene: test invalid type', async () => {
  const sceneStructure = {
    type: 'blurb',
    x: 1,
    y: 2,
    z: 0
  }
  const result = await validate(sceneStructure)
  expect(result.isValid).toBe(false)
})

test('Scene: test NaN', async () => {
  const sceneStructure = {
    type: 'wall',
    l: 'a',
    h: 1,
    w: 0.1
  }
  const result = await validate(sceneStructure)
  expect(result.isValid).toBe(false)
})

test('Scene: invalid children', async () => {
  const sceneStructure = {
    type: 'wall',
    l: 2,
    h: 1,
    w: 0.1,
    id: "2335fa98-2c0c-4168-8cde-9b2347789029",
    x: 0,
    y: 0,
    z: 0,
    ry: 0,
    children: [
      {
        type: 'wall',
        l: 2,
        h: 1,
        w: 0.1
      }
    ]
  }
  const result = await validate(sceneStructure)
  expect(result.isValid).toBe(false)
  expect(result.errors[0].code).toBe(7)
})

test('Scene: test valid scene structure', async () => {
  const sceneStructure = {
    type: 'wall',
    l: 2,
    h: 1,
    w: 0.1,
    x: 0,
    y: 0,
    z: 0,
    ry: 0,
    id: "a3ad7e08-66f9-40ce-a480-827220f8c52b",
    children: [
      {
        type: 'window',
        x: 0.8,
        y: 0.5,
        z: 0,
        ry: 0,
        l: 0.5,
        h: 1,
        id: "177f8aee-dbc6-4398-b9a7-f7b820eb9fa9"
      }
    ]
  }
  const result = await validate(sceneStructure)
  expect(result.isValid).toBe(true)
})
