import applyDefaults from '../../../src/scene/structure/apply-defaults.js';

test('applyDefaults', () => {
  const el3d = {
    type: 'wall',
    l: 1
  }
  const _el3d = applyDefaults(el3d)
  expect(_el3d.h).toBe(2.4)
  expect(_el3d.x).toBe(0)
  expect(_el3d.children).toEqual([])
});
