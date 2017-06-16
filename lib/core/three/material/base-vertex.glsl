varying vec3 vViewPosition;

#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif

#include <uv_pars_vertex>
#include <uv2_pars_vertex>

void main()
{
//  vUv = uv;
  #include <uv_vertex>
  #include <uv2_vertex>

  #include <beginnormal_vertex> //vec3 objectNormal = vec3( normal );
  #include <defaultnormal_vertex> // Flip side + vec3 transformedNormal = normalMatrix * objectNormal;

  #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
  	vNormal = normalize( transformedNormal );
  #endif

  #include <begin_vertex> // vec3 transformed = vec3( position );
  #include <project_vertex> //vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 ); set gl_position

  vViewPosition = - mvPosition.xyz;


  /*////////// custom
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;*/
}