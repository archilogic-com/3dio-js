import door from '../../../../src/aframe/component/architecture-toolkit/door.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get door data3d', () => {
  const el3d = applyDefaults({type: 'door'})

  door.attributes = el3d
  const data3d = door.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual(['frame', 'handle', 'leaf', 'threshold'])
  expect(data3d.frame.positions).toBeDefined()
  expect(data3d.frame.normals).toBeDefined()
});