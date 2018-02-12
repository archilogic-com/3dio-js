import toAframeElements from '../../../src/scene/structure/to-aframe-elements.js';
import { getAttributes, parseCameraBookmarks } from '../../../src/scene/structure/to-aframe-elements.js';

// module is using assertBrowser to verify its environment
jest.mock('../../../src/core/runtime.js', () => ({
  isBrowser: false, 
  assertBrowser: () => {}, 
  isNode: true
}))

test('sceneStructure to a-entity', () => {
  const sceneStructure = {
    type: 'wall',
    x: 0,
    y: 0,
    l: 2
  }
  const el = toAframeElements(sceneStructure)
  const wallComponent = el.getAttribute('io3d-wall')
  expect(typeof wallComponent).toBe('string')
  expect(wallComponent.includes('l: 2')).toBe(true)
});

test('getAttributes from sceneStructure element', () => {
  const el3d = {
    type: 'polyfloor',
    x: 0,
    y: 0,
    polygon: [[0,1], [1,1], [1,0], [0,0]]
  }
  const attr = getAttributes(el3d)
  expect(typeof attr).toBe('object')
  expect(typeof attr.position).toBe('string')
});

test('parseCameraBookmarks', () => {
  const sceneStructure = {
    type: 'plan',
    x: 0,
    y: 0,
    ry: 12,
    children: [
      {
        type: 'camera-bookmark',
        x: 0,
        y: 1.6,
        z: 5,
        mode: 'person',
        distance: 0
      }
    ]
  }
  const cameraEl = parseCameraBookmarks([sceneStructure])

  expect(cameraEl.getAttribute('camera')).toBeDefined()
  expect(cameraEl.children.length).toBe(1)
  const wayPoints = cameraEl.querySelectorAll('[tour-waypoint]')
  expect(wayPoints.length).toBe(1)
});
