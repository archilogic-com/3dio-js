import normalize from '../../../src/scene/structure/normalize.js';
import validate from '../../../src/scene/structure/validate.js';

// sceneStructure normalization

test('Scene: valid types', async () => {
  const sceneStructure = [
    { type: 'box'},
    { type: 'camera-bookmark'},
    { type: 'closet'},
    { type: 'curtain'},
    { type: 'door'},
    { type: 'floor'},
    { type: 'floorplan'},
    { type: 'group'},
    { type: 'interior'},
    { type: 'kitchen'},
    { type: 'level'},
    { type: 'object'},
    { type: 'plan'},
    { type: 'polybox'},
    { type: 'polyfloor'},
    { type: 'railing'},
    { type: 'stairs'},
    { type: 'tag'},
    { type: 'wall'},
    { type: 'window'}
  ]
  const result = await normalize(sceneStructure)
  expect(result.length).toBe(20)
})

test('Scene: normalize removes invalid children', async () => {
  const sceneStructure = {
    type: 'wall',
    l: 2,
    h: 1,
    w: 0.1,
    children: [
      {
        type: 'wall',
        l: 2,
        h: 1,
        w: 0.1
      }
    ]
  }
  expect(await validate(sceneStructure)).toBe( false )
  const result = await normalize(sceneStructure)
  expect(await validate(result)).toBe( true )
  expect(result.children).toBe( [] )

})

test('Scene: normalize simple scene structure array', async () => {
  const sceneStructure = [
    {
      type: 'wall',
      l: 2,
      foo: 'bar'
    },
    {
      type: 'foo',
      l: 2
    }
  ]
  const result = await normalize(sceneStructure)
  // invalid param removed
  expect(result[0].foo).toBeUndefined()
  // valid param still there
  expect(result[0].type).toBe('wall')
  // invalid element removed
  expect(result[1]).toBeUndefined()
})

test('Scene: normalize nested scene structure object', async () => {
  const sceneStructure = {
    type: 'wall',
    l: 2,
    foo: 'bar',
    children: [
      {
        type: 'group',
        l: 5
      },
      {
        type: 'window',
        l: 1,
        children: [
          {
            type: 'wall'
          }
        ],
        bar: 'foo'
      },
      {
        type: 'foo',
        l: 1
      }
    ]
  }
  const result = await normalize(sceneStructure)
  // invalid param removed
  expect(result.foo).toBeUndefined()
  // children with invalid type removed
  expect(result.children.length).toBe(1)
  // invalid child removed
  expect(result.children[0].children.length).toBe(0)
})

test('Scene: normalize numbers', async () => {
  const sceneStructure = {
    type: 'wall',
    l: '2.12'
  }

  const result = await normalize(sceneStructure)
  // invalid type adapted
  expect(typeof result.l).toBe('number')
  // value preserved
  expect(result.l).toBe(2.12)
})


test('Scene: normalize integers', async () => {
  const sceneStructure = {
    type: 'kitchen',
    highCabinetLeft: '2.12'
  }

  const result = await normalize(sceneStructure)
  // invalid type adapted
  expect(typeof result.highCabinetLeft).toBe('number')
  // value preserved
  expect(result.highCabinetLeft).toBe(2)
})
