import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';
import closet from '../../../../src/scene/structure/parametric-objects/closet'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get closet data3d', async function() {
  const attributes = applyDefaults({type: 'closet'})
  const data3d = await closet(attributes)
  
  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'closet' ])
  expect(data3d.meshes.closet.positions).toBeDefined()
  expect(data3d.meshes.closet.uvs).toBeDefined()
});
