import getStructure from '../../../src/scene/structure/get'

// mock runtime module to prevent from tests blowing up
jest.mock('../../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require}))

test('Scene: get sceneStructure form id', async () => {
  const id = '5a281187-475a-4613-8fa5-a2e92af9914d'
  const result = await getStructure(id)
  expect(result.type).toBe('plan')
  expect(result.children[0].type).toBe('level')
})