import search from '../../src/furniture/search'
import getInfo from '../../src/furniture/get-info'
import get from '../../src/furniture/get'

// mock runtime module to prevent from tests blowing up
jest.mock('../../src/core/runtime.js', () => ({isBrowser: false, isNode: true}))

test('Furniture: search for chairs', async () => {
  const result = await search('chair')
  expect(result.length).toBeGreaterThan(10)
})

test('Furniture: search for chairs - bad formatted', async () => {
  const result = await search(' -generic tags:chair  task  categories:office  ')
  expect(result.length).toBeGreaterThan(10)
})

test('Furniture: get name from specific chair', async () => {
  const result = await getInfo('097f03fe-1947-40ee-a176-45106c51460f')
  expect(result.name).toBe('Drop')
})

test('Furniture: get data from specific chair', async () => {
  const result = await get('097f03fe-1947-40ee-a176-45106c51460f')
  expect(result.info.name).toBe('Drop')
})