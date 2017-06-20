uniform vec3 diffuse; //-> diffuse color
uniform vec3 emissive;
uniform vec3 specular; // -> specular color
uniform float shininess;
uniform float opacity;

#include <common>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <lightmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>

#include <bsdfs> //??
#include <lights_pars>
#include <lights_phong_pars_fragment>


void main() {

    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

    vec3 totalEmissiveRadiance = emissive;

    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    #include <normal_flip>
    #include <normal_fragment>

    // accumulation
    #include <lights_phong_fragment>

    // include <light-template>
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

            vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;

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

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    gl_FragColor = vec4( outgoingLight, diffuseColor.a );

    /* ////////// custom
    #if defined( USE_LIGHTMAP )
        gl_FragColor = texture2D(lightMap, vUv2);
    #else
        gl_FragColor = vec4(color, opacity);
    #endif

    #if defined( USE_MAP )
        vec3 mapColor = texture2D(map, vUv, 0.0).rgb;
        gl_FragColor *= vec4(mapColor, 1.0) * 1.1;
    #endif

    */

}