// clean up empty meshes to prevent errors on material update
export default function (meshes) {
  Object.keys(meshes).forEach(key => {
    if (!meshes[key].positions || !meshes[key].positions.length) {
      //console.warn('no vertices for mesh', key)
      delete meshes[key]
    }
  })
}
