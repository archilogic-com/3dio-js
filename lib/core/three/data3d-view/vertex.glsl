attribute vec2 uv2;
varying vec2 vUv;
varying vec2 vUv2;

void main()
{
  vUv = uv;
  #if defined( USE_LIGHTMAP )
    vUv2 = uv2;
  #endif
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}