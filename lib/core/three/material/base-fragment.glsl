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
  #include <lights_template>

  // modulation
  //#include <lightmap_fragment>
  //#include <aomap_fragment>

  vec3 outgoingLight = vec3(specularStrength);//reflectedLight.directDiffuse;// + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

  gl_FragColor = vec4( outgoingLight, diffuseColor.a );

  /*#if defined( USE_NORMALMAP )
    vec3 mapColor = texture2D(normalMap, vUv, 0.0).rgb;
    gl_FragColor = vec4(mapColor, 1.0) * 1.1;
  #endif*/

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