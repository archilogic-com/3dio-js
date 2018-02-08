import wall from '../../../../src/aframe/component/architecture-toolkit/wall.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get wall data3d', () => {
  const el3d = applyDefaults({type: 'wall'})

  wall.attributes = el3d
  const data3d = wall.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'front', 'back', 'top', 'base' ])
  expect(data3d.front.positions).toBeDefined()
  expect(data3d.front.uvs).toBeDefined()
  expect(data3d.front.normals).toBeDefined()
});