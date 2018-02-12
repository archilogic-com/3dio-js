import stairs from '../../../../src/aframe/component/architecture-toolkit/stairs.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get stairs data3d', () => {
  const el3d = applyDefaults({type: 'stairs'})

  stairs.attributes = el3d
  const data3d = stairs.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'steps', 'tread', 'railing' ])
  expect(data3d.steps.positions).toBeDefined()
  expect(data3d.steps.uvs).toBeDefined()
});