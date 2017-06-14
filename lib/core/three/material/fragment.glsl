uniform sampler2D map;
uniform sampler2D lightMap;
uniform vec3 color;
uniform vec3 specular;
uniform float opacity;

varying vec2 vUv;
varying vec2 vUv2;

void main() {
  #if defined( USE_LIGHTMAP )
    //gl_FragColor = vec4(vUv2[0], vUv2[1], 0.0, 1.0);
    gl_FragColor = texture2D(lightMap, vUv2);
  #else
    gl_FragColor = vec4(color, opacity);
  #endif

  #if defined( USE_MAP )
    vec3 mapColor = texture2D(map, vUv, 0.0).rgb;
    gl_FragColor *= vec4(mapColor, 1.0) * 1.1;
  #endif

  //gl_FragColor = vec4(specular, opacity);
  				/*THREE.ShaderChunk[ "logdepthbuf_fragment" ],
  				THREE.ShaderChunk[ "map_fragment" ],
  				THREE.ShaderChunk[ "alphamap_fragment" ],
  				THREE.ShaderChunk[ "alphatest_fragment" ],
  				THREE.ShaderChunk[ "specularmap_fragment" ],

  				THREE.ShaderChunk[ "lights_phong_fragment" ],

  				THREE.ShaderChunk[ "lightmap_fragment" ],
  				THREE.ShaderChunk[ "color_fragment" ],
  				THREE.ShaderChunk[ "envmap_fragment" ],
  				THREE.ShaderChunk[ "shadowmap_fragment" ],

  				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

  				THREE.ShaderChunk[ "fog_fragment" ],*/
}