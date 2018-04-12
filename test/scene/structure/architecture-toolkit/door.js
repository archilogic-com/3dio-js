import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';
import door from '../../../../src/scene/structure/parametric-objects/door'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get door data3d', async function() {
  const attributes = applyDefaults({type: 'door'})
  const data3d = await door(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual(['frame', 'handle', 'leaf', 'threshold'])
  expect(data3d.meshes.frame.positions).toBeDefined()
  expect(data3d.meshes.frame.normals).toBeDefined()
});
