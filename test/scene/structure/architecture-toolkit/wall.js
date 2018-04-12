import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';
import wall from '../../../../src/scene/structure/parametric-objects/wall'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get wall data3d', async function() {
  const attributes = applyDefaults({type: 'wall'})
  const data3d = await wall(attributes)

  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'front', 'back', 'top', 'base' ])
  expect(data3d.meshes.front.positions).toBeDefined()
  expect(data3d.meshes.front.uvs).toBeDefined()
  expect(data3d.meshes.front.normals).toBeDefined()
});
