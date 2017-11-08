export default function getTextureUrls (data3d) {
  var materialUrls = []
  Object.keys(data3d.materials).forEach(function cacheMaterial(materialKey) {
    var material = data3d.materials[materialKey]
    if (material.mapDiffuse) materialUrls.push(material.mapDiffuse)
    if (material.mapDiffusePreview) materialUrls.push(material.mapDiffusePreview)

    if (material.mapNormal) materialUrls.push(material.mapNormal)
    if (material.mapNormalPreview) materialUrls.push(material.mapNormalPreview)

    if (material.mapSpecular) materialUrls.push(material.mapSpecular)
    if (material.mapSpecularPreview) materialUrls.push(material.mapSpecularPreview)

    if (material.mapAlpha) materialUrls.push(material.mapAlpha)
    if (material.mapAlphaPreview) materialUrls.push(material.mapAlphaPreview)

    if (material.mapLight) materialUrls.push(material.mapLight)
    if (material.mapLightPreview) materialUrls.push(material.mapLightPreview)
  })

  return materialUrls
}
