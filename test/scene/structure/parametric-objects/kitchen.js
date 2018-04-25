import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import kitchen from '../../../../src/scene/structure/parametric-objects/kitchen'
import { isNaN } from 'lodash'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require }))

test('get kitchen data3d', async function() {
  const attributes = applyDefaults({type: 'kitchen'})
  const data3d = await kitchen(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual(['sink_0', 'kitchen', 'counter', 'oven', 'cooktop', 'extractor', 'microwave'])
  expect(data3d.meshes.kitchen.positions).toBeDefined()
  expect(data3d.meshes.kitchen.uvs).toBeDefined()
  // check for valid vertices
  expect(data3d.meshes.sink_0.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.kitchen.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.counter.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.oven.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.cooktop.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.extractor.positions.every(a => !isNaN(a))).toBeTruthy()
});
