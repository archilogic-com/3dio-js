import window from '../../../../src/aframe/component/architecture-toolkit/window.js';
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get window data3d', () => {
  const el3d = applyDefaults({type: 'window'})

  window.attributes = el3d
  const data3d = window.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'frame', 'glass' ])
  expect(data3d.frame.positions).toBeDefined()
  expect(data3d.frame.normals).toBeDefined()
});