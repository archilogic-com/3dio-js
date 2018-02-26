import pic from '../../../../src/aframe/component/architecture-toolkit/pic.js'
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import { isNaN } from 'lodash'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get pic data3d', () => {
  const el3d = applyDefaults({type: 'pic'})

  pic.attributes = el3d

  const meshes = pic.generateMeshes3d()
  const materials = pic.generateMaterials()
  // mesh names
  expect(Object.keys(meshes)).toEqual([ 'frame', 'mat', 'pic' ])
  expect(meshes.pic.positions).toBeDefined()
  expect(meshes.pic.uvs).toBeDefined()
  expect(meshes.pic.normals).toBeDefined()
  // check for valid vertices
  expect(meshes.frame.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(meshes.pic.positions.every(a => !isNaN(a))).toBeTruthy()
  expect(meshes.mat.positions.every(a => !isNaN(a))).toBeTruthy()
  // material names
  expect(Object.keys(materials)).toEqual([ 'frame', 'mat', 'pic' ])
  // check for random applied picture
  expect(materials.pic.mapDiffuse).toBeDefined()
  expect(typeof materials.pic.mapDiffuse).toBe('string')
  expect(materials.pic.mapDiffuse !== '').toBeTruthy()
});
