import uuid from '../../src/utils/uuid.js';

test('UUID: validates correct UUIDs', () => {
  expect(uuid.validate('7078987a-d67c-4d01-bd7d-a3c4bb51244b')).toBe(true)
});

test('UUID: rejects invalid UUIDs', () => {
  expect(uuid.validate('xxx8987a-d67c-4d01-bd7d-a3c4bb51244b')).toBe(false)
})

test('UUID: generated UUIDs should validate', () => {
  const result = uuid.validate(uuid.generate())
  expect(result).toBe(true)
})