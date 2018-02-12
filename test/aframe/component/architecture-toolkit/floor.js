import floor from '../../../../src/aframe/component/architecture-toolkit/floor.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get floor data3d', () => {
  const el3d = applyDefaults({type: 'floor'})

  floor.attributes = el3d
  const data3d = floor.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'top', 'sides', 'ceiling' ])
  expect(data3d.top.positions).toBeDefined()
  expect(data3d.top.uvs).toBeDefined()
  expect(data3d.top.normals).toBeDefined()
});