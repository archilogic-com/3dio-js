uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;

attribute vec3 a_position;
attribute vec3 a_normal;

varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_binormal;
varying vec3 v_tangent;

void main() {
  vec3 objPosition = a_position;
  vec4 worldPosition = vec4(objPosition, 1.0);

  // Our object space has no rotation and no scale, so this is fine.
  v_normal = a_normal;
  v_position = worldPosition.xyz;
  // Looking for an arbitrary vector that isn't parallel to the normal.  Avoiding axis directions should improve our chances.
  vec3 arbitraryVector = normalize(vec3(0.42, -0.21, 0.15));
  vec3 alternateArbitraryVector = normalize(vec3(0.43, 1.5, 0.15));
  // If arbitrary vector is parallel to the normal, choose a different one.
  v_tangent = normalize(abs(dot(v_normal, arbitraryVector)) < 1.0 ? cross(v_normal, arbitraryVector) : cross(v_normal, alternateArbitraryVector));
  v_binormal = normalize(cross(v_normal, v_tangent));

  gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(objPosition, 1.0);
}
