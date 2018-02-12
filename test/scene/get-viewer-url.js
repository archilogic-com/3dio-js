import getViewerUrl from '../../src/scene/get-viewer-url'

test('Scene: get url form id', () => {
  const id = '7078987a-d67c-4d01-bd7d-a3c4bb51244b'
  const url = getViewerUrl({sceneId: id})
  expect(url).toBe('https://spaces.archilogic.com/3d/!' + id)
})