import test from 'ava'
import io3d from '../build/3dio'

test('Furniture: search for chairs', t => {
  return io3d.furniture.search('chair')
    .then(result => {
      t.true(result.length > 10)
    })
})

test('Furniture: search for chairs - bad formatted', t => {
  return io3d.furniture.search(' -generic tags:chair  task  categories:office  ')
    .then(result => {
      t.true(result.length > 10)
    })
})

test('Furniture: get name from specific chair', t => {
  return io3d.furniture.getInfo('097f03fe-1947-40ee-a176-45106c51460f')
    .then(result => {
      t.is(result.name, 'Drop')
    })
})

test('Furniture: get data from specific chair', t => {
  return io3d.furniture.get('097f03fe-1947-40ee-a176-45106c51460f')
    .then(result => {
      t.is(result.info.name, 'Drop')
    })
})