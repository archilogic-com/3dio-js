#include <uv_pars_vertex>
#include <uv2_pars_vertex>

void main()
{
//  vUv = uv;
  #include <uv_vertex>
  #include <uv2_vertex>

  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}