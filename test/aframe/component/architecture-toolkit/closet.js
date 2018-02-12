import closet from '../../../../src/aframe/component/architecture-toolkit/closet.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get closet data3d', () => {
  const el3d = applyDefaults({type: 'closet'})

  closet.attributes = el3d
  const data3d = closet.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'closet' ])
  expect(data3d.closet.positions).toBeDefined()
  expect(data3d.closet.uvs).toBeDefined()
});