import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import window from '../../../../src/scene/structure/parametric-objects/window'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get window data3d', async function(){
  const attributes = applyDefaults({type: 'window'})
  const data3d = await window(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'frame', 'glass' ])
  expect(data3d.meshes.frame.positions).toBeDefined()
  expect(data3d.meshes.frame.normals).toBeDefined()
});
