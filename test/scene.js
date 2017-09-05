import test from 'ava'
import io3d from '../build/3dio'

// url from scene id

test('Scene: get url form id', t => {
  const id = '7078987a-d67c-4d01-bd7d-a3c4bb51244b'
  const url = io3d.scene.getViewerUrl({sceneId: id})
  t.is(url, 'https://spaces.archilogic.com/3d/!' + id)
})

// sceneStructure validation

test('Scene: test invalid type', t => {
  const sceneStructure = {
    type: 'blurb',
    x: 1,
    y: 2,
    z: 0
  }
  return io3d.scene.validateSceneStructure(sceneStructure)
    .then(result => {
      t.is(result.isValid, false)
    })
})

test('Scene: test NaN', t => {
  const sceneStructure = {
    type: 'wall',
    l: 'a',
    h: 1,
    w: 0.1
  }
  return io3d.scene.validateSceneStructure(sceneStructure)
    .then(result => {
      t.is(result.isValid, false)
    })
})

test('Scene: invalid children', t => {
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
  return io3d.scene.validateSceneStructure(sceneStructure)
    .then(result => {
      t.is(result.isValid, false)
      t.is(result.errors[0].code, 7)
    })
})

test('Scene: test valid scene structure', t => {
  const sceneStructure = {
    type: 'wall',
    l: 2,
    h: 1,
    w: 0.1,
    children: [
      {
        type: 'window',
        x: 0.8,
        y: 0.5,
        l: 0.5,
        h: 1
      }
    ]
  }
  return io3d.scene.validateSceneStructure(sceneStructure)
    .then(result => {
      t.is(result.isValid, true)
    })
})

// sceneStructure normalization

test('Scene: fix invalid children', t => {
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
  return io3d.scene.normalizeSceneStructure(sceneStructure)
    .then(io3d.scene.validateSceneStructure)
    .then(result => {
      console.log(result)
      t.is(result.isValid, true)
    })
})

test('Scene: normalize simple scene structure array', t => {
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
  return io3d.scene.normalizeSceneStructure(sceneStructure)
    .then(result => {
      // invalid param removed
      t.true(!result[0].foo)
      // valid param still there
      t.true(result[0].type === 'wall')
      // invalid element removed
      t.true(!result[1])
  })
})

test('Scene: normalize nested scene structure object', t => {
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
  return io3d.scene.normalizeSceneStructure(sceneStructure)
    .then(result => {
      // invalid param removed
      t.true(!result.foo)
      // children with invalid type removed
      t.true(result.children.length === 1)
      // invalid child removed
      t.true(result.children[0].children.length === 0)
  })
})