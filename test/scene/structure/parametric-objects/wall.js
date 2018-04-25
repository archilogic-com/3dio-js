import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import wall from '../../../../src/scene/structure/parametric-objects/wall'
import { isNaN } from 'lodash'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require}))

test('get wall data3d', async function() {
  const attributes = applyDefaults({type: 'wall'})
  const data3d = await wall(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'front', 'back', 'top', 'base' ])
  expect(data3d.meshes.front.positions).toBeDefined()
  expect(data3d.meshes.front.uvs).toBeDefined()
  expect(data3d.meshes.front.normals).toBeDefined()
  // check for valid vertices
  expect(data3d.meshes.front.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.back.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.top.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.base.positions.every(a => !isNaN(a))).toBeTruthy()
});
