import test from 'ava'
import io3d from '../build/3dio'



test('UUID: validates correct UUIDs', t => {
  t.is(io3d.utils.uuid.validate('7078987a-d67c-4d01-bd7d-a3c4bb51244b'), true)
})

test('UUID: rejects invalid UUIDs', t => {
  t.is(io3d.utils.uuid.validate('xxx8987a-d67c-4d01-bd7d-a3c4bb51244b'), false)
})

test('UUID: generated UUIDs should validate', t => {
  const result = io3d.utils.uuid.validate(io3d.utils.uuid.generate())
  t.is(result, true)
})