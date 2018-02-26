import curtain from '../../../../src/aframe/component/architecture-toolkit/curtain.js'
import applyDefaults from '../../../../src/scene/structure/apply-defaults.js'
import { isNaN } from 'lodash'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('get curtain data3d', () => {
  const el3d = applyDefaults({type: 'curtain'})

  curtain.attributes = el3d
  const data3d = curtain.generateMeshes3d()
  // mesh names
  expect(Object.keys(data3d)).toEqual([ 'curtain' ])
  expect(data3d.curtain.positions).toBeDefined()
  expect(data3d.curtain.uvs).toBeDefined()
  // check for valid vertices
  expect(data3d.curtain.positions.every(a => !isNaN(a))).toBeTruthy()
});