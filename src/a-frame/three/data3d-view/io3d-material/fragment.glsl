uniform vec3 color;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>

// Replaces <lightmap_pars_fragment>;

#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
	uniform float lightMapExposure;
	uniform float lightMapFalloff;
#endif

#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>

#include <bsdfs>
#include <lights_pars>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>


void main() {

    vec4 diffuseColor = vec4( color, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

    vec3 totalEmissiveRadiance = emissive;

    #include <map_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>

    // Start of <normal_fragment> replace block
    #ifdef FLAT_SHADED

      // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...

      vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
      vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
      vec3 normal = normalize( cross( fdx, fdy ) );

    #else

      vec3 normal = normalize( vNormal );

      #ifdef DOUBLE_SIDED

        normal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );

      #endif

    #endif

    #ifdef USE_NORMALMAP

      normal = perturbNormal2Arb( -vViewPosition, normal );

    #elif defined( USE_BUMPMAP )

      normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );

    #endif
    // End of <normal_fragment> replace block

    // accumulation
    #include <lights_phong_fragment>

    // Start of <light-template> replace block
    GeometricContext geometry;

    geometry.position = - vViewPosition;
    geometry.normal = normal;
    geometry.viewDir = normalize( vViewPosition );

    IncidentLight directLight;

    #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

        PointLight pointLight;

        for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

            pointLight = pointLights[ i ];

            getPointDirectLightIrradiance( pointLight, geometry, directLight );

            #ifdef USE_SHADOWMAP
            directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;
            #endif

            RE_Direct( directLight, geometry, material, reflectedLight );

        }

    #endif

    #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

        SpotLight spotLight;

        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

            spotLight = spotLights[ i ];

            getSpotDirectLightIrradiance( spotLight, geometry, directLight );

            #ifdef USE_SHADOWMAP
            directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
            #endif

            RE_Direct( directLight, geometry, material, reflectedLight );

        }

    #endif

    #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )

        DirectionalLight directionalLight;

        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

            directionalLight = directionalLights[ i ];

            getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );

            #ifdef USE_SHADOWMAP
            directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
            #endif

            RE_Direct( directLight, geometry, material, reflectedLight );

        }

    #endif

    #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

        RectAreaLight rectAreaLight;

        for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

            rectAreaLight = rectAreaLights[ i ];
            RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );

        }

    #endif

    #if defined( RE_IndirectDiffuse )

        vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

        #ifdef USE_LIGHTMAP

            // compute the light value
            vec3 unit = vec3(1.0);
            vec3 light = 2.0 * (texture2D( lightMap, vUv2 ).xyz - lightMapExposure * unit);
            // compute the light intensity modifier
            vec3 modifier = -lightMapFalloff * light * light + unit;
            // apply light
            vec3 lightMapIrradiance = light * modifier * lightMapIntensity;

            #ifndef PHYSICALLY_CORRECT_LIGHTS

                lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage

            #endif

            irradiance += lightMapIrradiance;

        #endif

        #if ( NUM_HEMI_LIGHTS > 0 )

            for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

                irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );

            }

        #endif

        RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );

    #endif
    // End of <light-template> replace block

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    gl_FragColor = vec4( outgoingLight, diffuseColor.a );

}