import railing from '../../../../src/aframe/component/architecture-toolkit/railing.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get stairs data3d', () => {
  const el3d = applyDefaults({type: 'railing'})

  railing.attributes = el3d
  const data3d = railing.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'railing' ])
  expect(data3d.railing.positions).toBeDefined()
});