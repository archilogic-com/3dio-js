import column from '../../../../src/aframe/component/architecture-toolkit/column.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get column data3d', () => {
  const el3d = applyDefaults({type: 'column'})

  column.attributes = el3d
  const data3d = column.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'top', 'sides', 'bottom' ])
  expect(data3d.sides.positions).toBeDefined()
  expect(data3d.sides.uvs).toBeDefined()
  expect(data3d.sides.normals).toBeDefined()
});