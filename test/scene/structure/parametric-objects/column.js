import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import column from '../../../../src/scene/structure/parametric-objects/column'
import { isNaN } from 'lodash'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get column data3d', async function() {
  const attributes = applyDefaults({type: 'column'})
  const data3d = await column(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'top', 'sides', 'bottom' ])
  expect(data3d.meshes.top.positions).toBeDefined()
  expect(data3d.meshes.top.uvs).toBeDefined()
  expect(data3d.meshes.top.normals).toBeDefined()
  expect(data3d.meshes.sides.positions).toBeDefined()
  expect(data3d.meshes.sides.uvs).toBeDefined()
  expect(data3d.meshes.sides.normals).toBeDefined()

  // check for valid vertices
  expect(data3d.meshes.top.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.sides.positions.every(a => !isNaN(a))).toBeTruthy()
});
