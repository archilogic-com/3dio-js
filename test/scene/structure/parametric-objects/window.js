import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import window3d from '../../../../src/scene/structure/parametric-objects/window3d'
import { isNaN } from 'lodash'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get window data3d', async function(){
  const attributes = applyDefaults({type: 'window'})
  const data3d = await window3d(attributes)

  // mesh names
  expect(Object.keys(data3d.meshes)).toEqual([ 'frame', 'glass' ])
  expect(data3d.meshes.frame.positions).toBeDefined()
  expect(data3d.meshes.frame.normals).toBeDefined()
  // check for valid vertices
  expect(data3d.meshes.frame.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(data3d.meshes.glass.positions.every(a => !isNaN(a))).toBeTruthy()
});
