import getFurnitureAlternatives from '../../src/staging/get-furniture-alternatives'

// mock runtime module to prevent from tests blowing up
jest.mock('../../src/core/runtime.js', () => ({isBrowser: false, isNode: true, require: require}))

// replace furniture
test('alternatives for tv query is ignored', async () => {
  const id = 'effd9517-dcec-410e-8bcd-257f23e74d4a'
  // create copy to test against later
  const result = await getFurnitureAlternatives(id, {query: 'nordic'})
  expect(result.length).toBeGreaterThan(1)
})

// replace furniture
test('alternatives for chair', async () => {
  const id = '5b97e7b5-2d13-4489-bf76-013ad70949fe'
  // create copy to test against later
  const result = await getFurnitureAlternatives(id)
  expect(result.length).toBeGreaterThan(10)
})

// replace furniture
test('alternatives for generic shelf', async () => {
  const id = '02bb9b24-3265-4578-bdb1-355961ea7002'
  // create copy to test against later
  const result = await getFurnitureAlternatives(id, {query: 'minimal'})
  console.log(result)
  expect(result).toBeGreaterThan(10)
})