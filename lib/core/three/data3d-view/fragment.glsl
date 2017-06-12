uniform sampler2D map;

varying vec2 vUv;
varying vec2 vUv2;

void main() {
  #if defined( USE_LIGHTMAP )
    gl_FragColor = vec4(vUv2[0], vUv2[1], 0.0, 1.0);
  #else
    gl_FragColor = vec4(0.0, 0.8, 0.9, 0.3);
  #endif

  #if defined( USE_MAP )

  #endif
}