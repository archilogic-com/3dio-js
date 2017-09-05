import test from 'ava'
import io3d from '../build/3dio'

test('Scene: get url form id', t => {
  const id = '7078987a-d67c-4d01-bd7d-a3c4bb51244b'
  const url = io3d.scene.getViewerUrl({sceneId: id})
  t.is(url, 'https://spaces.archilogic.com/3d/!' + id)
})