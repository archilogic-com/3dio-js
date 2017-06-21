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

  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>

  #ifndef FLAT_SHADED
    // Normal computed with derivatives when FLAT_SHADED
  	vNormal = normalize( transformedNormal );
  #endif

  #include <begin_vertex>
  #include <project_vertex>

  vViewPosition = - mvPosition.xyz;

}