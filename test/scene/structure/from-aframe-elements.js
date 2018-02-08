import fromAframeElements from '../../../src/scene/structure/from-aframe-elements.js';
import { stringToCoordinate, parseComponent } from '../../../src/scene/structure/from-aframe-elements.js';

test('a-entity to sceneStructure', () => {
  const el = document.createElement('a-entity')
  el.setAttribute('io3d-wall', 'w: 0.15; l: 4; h: 2')
  el.setAttribute('position', '2 0 -5')
  el.setAttribute('rotation', '0 0 0')
  el.setAttribute('io3d-uuid', '7078987a-d67c-4d01-bd7d-a3c4bb51244b')
  const sceneStructure = fromAframeElements(el)
  expect(sceneStructure.l).toBe(4)
  expect(sceneStructure.w).toBe(0.15)
  expect(sceneStructure.x).toBe(2)
  expect(sceneStructure.z).toBe(-5)
  expect(sceneStructure.id).toBe('7078987a-d67c-4d01-bd7d-a3c4bb51244b')
});

test('a-entity children to sceneStructure', () => {
  const el = document.createElement('a-entity')
  el.setAttribute('io3d-wall', 'w: 0.15; l: 4; h: 2')
  el.setAttribute('position', '2 0 -5')
  el.setAttribute('rotation', '0 0 0')
  el.setAttribute('io3d-uuid', '7078987a-d67c-4d01-bd7d-a3c4bb51244b')
  const doorEl = document.createElement('a-entity')
  doorEl.setAttribute('io3d-door', 'l: 1.2; hinge: left; side: front')
  el.appendChild(doorEl)
  const sceneStructure = fromAframeElements(el)
  const children = sceneStructure.children
  expect(children.length).toBe(1)
  expect(children[0].l).toBe(1.2)
  expect(children[0].hinge).toBe('left')
});

test('stringToCoordinate', () => {
  const str = '12 0.12 0'
  const obj = stringToCoordinate(str)
  expect(obj.x).toBe(12)
  expect(obj.y).toBe(0.12)
  expect(obj.z).toBe(0)
});

test('parse component', () => {
  const str = 'w: 0.15; hinge: left; h: 2'
  const type = 'door'
  const obj = parseComponent(str, type)
  expect(obj.w).toBe(0.15)
  expect(obj.hinge).toBe('left')
  expect(obj.h).toBe(2)
});