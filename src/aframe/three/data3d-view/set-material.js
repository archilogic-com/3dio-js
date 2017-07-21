/*

 PERFORMANCE CRITICAL CODE

 readability may suffer from performance optimization
 ask tomas-polach if you have questions

*/

import loadTextures from './load-textures.js'
import runtime from '../../../core/runtime.js'

// static method, @memberof View

// constants

var HI_RES_TEXTURE_TYPES = {
  UV1: [ 'mapDiffuse', 'mapSpecular', 'mapNormal', 'mapAlpha' ],
  UV2: 'mapLight'
}
var LO_RES_TEXTURE_TYPES = {
  UV1: [ 'mapDiffusePreview', 'mapSpecularPreview', 'mapNormalPreview', 'mapAlphaPreview' ],
  UV2: 'mapLightPreview'
}

// RepeatWrapping: 1000 / ClampToEdgeWrapping: 1001 / MirroredRepeatWrapping: 1002

// function

export default function setMaterial (args) {

  // Args
  var vm = args.vm
  var material3d = args.material3d
  var mesh3d = args.mesh3d
  var _attributes = args.attributes || {}
  var reset = args.reset !== undefined ? args.reset : true
  var loadingQueuePrefix = args.loadingQueuePrefix
  var onFirstTextureSetLoaded = args.onFirstTextureSetLoaded
  var lightMapIntensity = args.lightMapIntensity
  var lightMapExposure = args.lightMapExposure


  // transparency

  //     material3d.transparent = true
  //     material3d.opacity = 0.55

  // depth buffer
  //    if (material3d.opacity < 1) {
  //      material3d.depthWrite = false
  //      var alphaTest = material3d.opacity - 0.001
  //      if (alphaTest < 0) alphaTest = 0
  //      material3d.alphaTest = alphaTest
  //    }

  // specular coefficient

  material3d.shininess = (_attributes.specularCoef !== undefined) ? (_attributes.specularCoef ) : 0.1
  material3d.uniforms.shininess.value = material3d.shininess

  // colors
  var diffuse = {}
  if (_attributes.colorDiffuse) {
    diffuse.r = _attributes.colorDiffuse[ 0 ]
    diffuse.g = _attributes.colorDiffuse[ 1 ]
    diffuse.b = _attributes.colorDiffuse[ 2 ]
  } else if (reset) {
    if (_attributes.mapDiffuse ) {
      // has diffuse texture
      diffuse.r = 1
      diffuse.g = 1
      diffuse.b = 1
    } else {
      // has NO diffuse texture
      diffuse.r = 0.85
      diffuse.g = 0.85
      diffuse.b = 0.85
    }
  }
  material3d.diffuse = diffuse
  material3d.uniforms.diffuse.value = new THREE.Color(diffuse.r, diffuse.g, diffuse.b)

  /*if (_attributes.colorAmbient) {
    // material3d.ambient.r = _attributes.colorAmbient[ 0 ]
    // material3d.ambient.g = _attributes.colorAmbient[ 1 ]
    // material3d.ambient.b = _attributes.colorAmbient[ 2 ]
  } else if (reset) {
    // if (!material3d.ambient) {
    //   material3d.ambient = new THREE.Color()
    // }
    // material3d.ambient.r = material3d.color.r
    // material3d.ambient.g = material3d.color.g
    // material3d.ambient.b = material3d.color.b
  }*/

  var specular = {}
  if (_attributes.colorSpecular) {
    specular.r = _attributes.colorSpecular[ 0 ]
    specular.g = _attributes.colorSpecular[ 1 ]
    specular.b = _attributes.colorSpecular[ 2 ]
  } else if (reset) {
    specular.r = 0.25
    specular.g = 0.25
    specular.b = 0.25
  }
  material3d.specular = specular
  material3d.uniforms.specular.value = new THREE.Color(specular.r, specular.g, specular.b)

  var emissive = {}
  if (_attributes.colorEmissive) {
    emissive.r = _attributes.colorEmissive[ 0 ]
    emissive.g = _attributes.colorEmissive[ 1 ]
    emissive.b = _attributes.colorEmissive[ 2 ]
  } else if (_attributes.lightEmissionCoef) {
    var emissiveIntensity = _attributes.lightEmissionCoef / 10
    if (_attributes.colorDiffuse) {
      emissive.r = _attributes.colorDiffuse[ 0 ]
      emissive.g = _attributes.colorDiffuse[ 1 ]
      emissive.b = _attributes.colorDiffuse[ 2 ]
    } else {
      emissive.r = 1.0
      emissive.g = 1.0
      emissive.b = 1.0
    }
    emissive.r *= emissiveIntensity
    emissive.g *= emissiveIntensity
    emissive.b *= emissiveIntensity

  } else if (reset) {
    emissive.r = 0
    emissive.g = 0
    emissive.b = 0
  }
  material3d.emissive = emissive
  material3d.uniforms.emissive.value = new THREE.Color(emissive.r, emissive.g, emissive.b)

  // lightmap settings
  if (_attributes.mapLight || _attributes.mapLightPreview) {
    // Fallback lightmap intensity and exposure values
    var lmi = 1.0
    var lme = 0.5

    if (lightMapIntensity !== undefined && lightMapIntensity != null) {
      lmi = lightMapIntensity
    } else if (_attributes.mapLightIntensity !== undefined) {
      lmi = _attributes.mapLightIntensity
    }

    if (lightMapExposure !== undefined && lightMapExposure != null) {
      lme = lightMapExposure
    } else if (_attributes.mapLightCenter !== undefined) {
      // in data3d lightMapExposure is mapLightCenter
      lme = _attributes.mapLightCenter
    }

    material3d.lightMapIntensity = lmi
    material3d.lightMapCenter = lme
    material3d.lightMapFalloff = (_attributes.mapLightFalloff !== undefined) ? _attributes.mapLightFalloff : 0.5
    material3d.uniforms.lightMapIntensity.value = material3d.lightMapIntensity
    material3d.uniforms.lightMapFalloff.value = material3d.lightMapCenter
    material3d.uniforms.lightMapCenter.value = material3d.lightMapFalloff
  }

  // shadows

  if (mesh3d) {
    // (2017/04/05) Interiors are currently not shadow receivers, as this
    // would produce many artifacts. However, flat and thin objects laying
    // very close to the floor (such as carpets) need to be excepted from
    // that rule. This is a temporary way to achieve that.
    if (!mesh3d.geometry.boundingBox)
      mesh3d.geometry.computeBoundingBox();
    var boundingBox = mesh3d.geometry.boundingBox;
    var position    = boundingBox.min.clone();
    position.applyMatrix4(mesh3d.matrixWorld);
    var meshIsFlat          = boundingBox.max.y - boundingBox.min.y < 0.05;
    var meshIsOnGroundLevel = position.y < 0.1;
    mesh3d.castShadow    = !(meshIsFlat && meshIsOnGroundLevel) && _attributes.castRealTimeShadows;
    mesh3d.receiveShadow =  (meshIsFlat && meshIsOnGroundLevel) || _attributes.receiveRealTimeShadows;
    mesh3d.material.needsUpdate = true // without this, receiveShadow does not become effective
  }

  // load textures

  // remember current textures (avoiding racing conditions between texture loading and material updates)
  material3d._texturesToBeLoaded = {
    // hires textures
    mapDiffuse: _attributes.mapDiffuse,
    mapSpecular: _attributes.mapSpecular,
    mapNormal: _attributes.mapNormal,
    mapAlpha: _attributes.mapAlpha,
    mapLight: _attributes.mapLight,
    // lores textures
    mapDiffusePreview: _attributes.mapDiffusePreview,
    mapSpecularPreview: _attributes.mapSpecularPreview,
    mapNormalPreview: _attributes.mapNormalPreview,
    mapAlphaPreview: _attributes.mapAlphaPreview,
    mapLightPreview: _attributes.mapLightPreview
  }

  var
    loadingTexturesPromise,
    loadingQueue,
    isLoadingLoResTextures,
    hasLoResTextures = _attributes.mapDiffusePreview || _attributes.mapSpecularPreview || _attributes.mapNormalPreview || _attributes.mapAlphaPreview || _attributes.mapLightPreview,
    // hasHiResTextures = _attributes.mapDiffuse || _attributes.mapSpecular || _attributes.mapNormal || _attributes.mapAlpha || _attributes.mapLight,
    // TODO: readd hiResTextures configs
    // hiResTexturesEnabled = !configs.isMobile && vm.viewport.a.hiResTextures && configs.compatibility.webglCompressedTextures
    hiResTexturesEnabled = !runtime.isMobile && runtime.webGl.supportsDds

  if (!hiResTexturesEnabled || (hasLoResTextures && !material3d.firstTextureLoaded)) {
    if (loadingQueuePrefix) {
      loadingQueue = loadingQueuePrefix + 'TexturesLoRes'
    }
    loadingTexturesPromise = loadTextures(loadingQueue, LO_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false)
    isLoadingLoResTextures = true
  } else {
    if (loadingQueuePrefix) {
      loadingQueue = loadingQueuePrefix + 'TexturesHiRes'
    }
    loadingTexturesPromise = loadTextures(loadingQueue, HI_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false)
    isLoadingLoResTextures = false
  }


  // set opacity after textures have loaded
  loadingTexturesPromise.then(function(){

    if (_attributes.opacity !== undefined && _attributes.opacity < 1) {
      // 0 = fully transparent, 1 = non-transparent
      material3d.transparent = true
      material3d.opacity = _attributes.opacity
    } else if (_attributes.mapAlpha) {
      // has alpha map
      material3d.transparent = true
      material3d.opacity = 1
    } else {
      material3d.transparent = false
      material3d.opacity = 1
    }
    material3d.uniforms.opacity = { value: material3d.opacity }

    // trigger callback
    if (onFirstTextureSetLoaded) onFirstTextureSetLoaded()

    // set onFirstTextureLoaded
    if (hasLoResTextures) material3d.firstTextureLoaded = true

  })

  // 2. load hi-res textures (if: material has preview texture set, not on mobile, hi-res enabled and supported)
  if (isLoadingLoResTextures && hiResTexturesEnabled) {
    loadingTexturesPromise.then(function(){
      if (loadingQueuePrefix) {
        loadingQueue = loadingQueuePrefix + 'TexturesHiRes'
      }
      loadTextures(loadingQueue, HI_RES_TEXTURE_TYPES, vm, _attributes, material3d, mesh3d, false)
    })
  }

  // return texture loading promise

  return loadingTexturesPromise
}
