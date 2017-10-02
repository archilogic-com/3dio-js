import uuid from '../../utils/uuid'

export default function getSceneStructureFromAframeElements(el) {
  if (!isValidElement(el)) {
    console.error('element is not an "a-entity" DOM element')
  }
  var
    position = el.getAttribute('position'),
    rotation = el.getAttribute('rotation'),
    furnitureInfo = el.getAttribute('io3d-furniture'),
    furnitureUuid = el.getAttribute('io3d-uuid'),
    sceneStructure

  sceneStructure = {
    x: position.x,
    y: position.y,
    z: position.z,
    ry: rotation.y,
    type: 'interior',
    src: '!' + furnitureInfo.id,
    id: furnitureUuid || uuid.generate()
  }

  return sceneStructure
}


// Returns true if it is a DOM element with nodeName a-entity
// https://stackoverflow.com/a/384380/2835973
function isValidElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string" && o.nodeName.toLowerCase() === 'a-entity'
  );
}