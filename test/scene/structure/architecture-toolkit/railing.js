import applyDefaults from '../../../../src/scene/structure/apply-defaults.js';
import railing from '../../../../src/scene/structure/parametric-objects/railing'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require}))

test('get railing data3d', async function() {
  const attributes = applyDefaults({type: 'railing'})
  const data3d = await railing(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'railing' ])
  expect(data3d.meshes.railing.positions).toBeDefined()
});
