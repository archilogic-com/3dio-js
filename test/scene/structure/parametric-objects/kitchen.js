import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';
import kitchen from '../../../../src/scene/structure/parametric-objects/kitchen'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require }))

test('get kitchen data3d', async function() {
  const attributes = applyDefaults({type: 'kitchen'})
  const data3d = await kitchen(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual(['sink_0', 'kitchen', 'counter', 'oven', 'cooktop', 'extractor', 'microwave'])
  expect(data3d.meshes.kitchen.positions).toBeDefined()
  expect(data3d.meshes.kitchen.uvs).toBeDefined()
});
