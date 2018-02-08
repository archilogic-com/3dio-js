import kitchen from '../../../../src/aframe/component/architecture-toolkit/kitchen.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get kitchen data3d', async () => {
  let el3d = applyDefaults({type: 'kitchen'})

  kitchen.attributes = el3d
  kitchen.materials = {}
  // kitchen mesh generation is async because of external dependencies
  const data3d = await kitchen.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual(['sink_0', 'kitchen', 'counter', 'oven', 'cooktop', 'extractor', 'microwave'])
  expect(data3d.kitchen.positions).toBeDefined()
  expect(data3d.kitchen.uvs).toBeDefined()
});