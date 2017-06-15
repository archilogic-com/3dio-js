uniform sampler2D map;
uniform sampler2D lightMap;
uniform vec3 color;
uniform vec3 specular;
uniform float opacity;

#include <uv_pars_fragment>
#include <uv2_pars_fragment>

void main() {
  #if defined( USE_LIGHTMAP )
    gl_FragColor = texture2D(lightMap, vUv2);
  #else
    gl_FragColor = vec4(color, opacity);
  #endif

  #if defined( USE_MAP )
    vec3 mapColor = texture2D(map, vUv, 0.0).rgb;
    gl_FragColor *= vec4(mapColor, 1.0) * 1.1;
  #endif
}