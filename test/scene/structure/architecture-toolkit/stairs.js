import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';
import stairs from '../../../../src/scene/structure/parametric-objects/stairs'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get stairs data3d', async function() {
  const attributes = applyDefaults({type: 'stairs'})
  const data3d = await stairs(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'steps', 'tread', 'railing' ])
  expect(data3d.meshes.steps.positions).toBeDefined()
  expect(data3d.meshes.steps.uvs).toBeDefined()
});
