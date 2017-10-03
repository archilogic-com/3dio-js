precision highp float;

const float INV_PI = 0.31830988618;
const float PI = 3.141592654;
const float _RefractiveIndex = 1.2;
const float environmentStrength = 1.5;

varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_binormal;
varying vec3 v_tangent;

uniform vec3 u_color;
uniform float u_metallic;
uniform float u_roughness;
uniform vec3 u_light0Pos;
uniform vec3 u_light0Color;
uniform vec3 u_light1Pos;
uniform vec3 u_light1Color;
uniform mat4 u_modelMatrix;
uniform sampler2D u_reflectionCube;
uniform sampler2D u_reflectionCubeBlur;

const float u_noiseIntensity = 0.015;
const float colorNoiseAmount = 0.015;
const float noiseScale = 700.0;

uniform vec3 cameraPosition;

// Noise functions from https://github.com/ashima/webgl-noise
// Used under the MIT license - license text in MITLICENSE
// Copyright (C) 2011 by Ashima Arts (Simplex noise)
// Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others)
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v, out vec3 gradient)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  vec4 m2 = m * m;
  vec4 m4 = m2 * m2;
  vec4 pdotx = vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3));

// Determine noise gradient
  vec4 temp = m2 * m * pdotx;
  gradient = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3);
  gradient += m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3;
  gradient *= 42.0;

  return 42.0 * dot(m4, pdotx);
}
// End of noise code

float GGX(float nDotH, float roughness2) {
  float nDotH2 = nDotH * nDotH;
  float alpha = nDotH2 * roughness2 + 1.0 - nDotH2;
  float denominator = PI * alpha * alpha;
  return (nDotH2 > 0.0 ? 1.0 : 0.0) * roughness2 / denominator;
}

float BlinnPhongNDF(float nDotH) {
  float exponent = (2.0 / (u_roughness * u_roughness) - 2.0);
  float coeff = 1.0 / (PI * u_roughness * u_roughness);
  return coeff * pow(nDotH, exponent);
}

float CT_GeoAtten(float nDotV, float nDotH, float vDotH, float nDotL, float lDotH) {
  float a = (2.0 * nDotH * nDotV) / vDotH;
  float b = (2.0 * nDotH * nDotL) / lDotH;
  return min(1.0, min(a, b));
}

float GeoAtten(float nDotV) {
 float c = nDotV / (u_roughness * sqrt(1.0 - nDotV * nDotV));
 return c >= 1.6 ? 1.0 :
     (3.535 * c + 2.181 * c * c) / (1.0 + 2.276 * c + 2.577 * c * c);

}

vec3 evaluateFresnelSchlick(float vDotH, vec3 f0) {
  return f0 + (1.0 - f0) * pow(1.0 - vDotH, 5.0);
}

float saturate(float value) {
  return clamp(value, 0.0, 1.0);
}

vec3 saturate(vec3 value) {
  return clamp(value, 0.0, 1.0);
}


mat3 transpose(mat3 inMat) {
  return mat3(inMat[0][0], inMat[0][1], inMat[0][2],
              inMat[1][0], inMat[1][1], inMat[1][2],
              inMat[2][0], inMat[2][1], inMat[2][2]);
}

void generatePapercraftColorNormal(vec3 normal, vec3 tangent, vec3 binormal, vec3 noisePos, inout vec4 outColorMult, inout vec3 outNormal) {
  mat3 tangentToObject;
  tangentToObject[0] = vec3(tangent.x, tangent.y, tangent.z);
  tangentToObject[1] = vec3(binormal.x, binormal.y, binormal.z);
  tangentToObject[2] = vec3(normal.x, normal.y, normal.z);

  mat3 objectToTangent = transpose(tangentToObject);


  vec3 intensificator = vec3(u_noiseIntensity, u_noiseIntensity, 1.0);
  vec3 tangentPos = objectToTangent * noisePos;
  vec3 gradient = vec3(0.0);
  float noiseOut = snoise(tangentPos * noiseScale, gradient);

  vec3 tangentSpaceNormal = normalize(intensificator * vec3(gradient.xy, 1.0));
  outNormal = tangentToObject * tangentSpaceNormal;

  outColorMult = vec4(vec3(1.0 + noiseOut * colorNoiseAmount), 1.0);
}

void evaluatePBRLight(
  vec3 materialColor,
  vec3 lightColor,
  float nDotL,
  float nDotV,
  float nDotH,
  float vDotH,
  float lDotH,
  inout vec3 diffuseOut,
  inout vec3 specularOut,
  inout vec3 debug,
  float specAmount) {
    vec3 diffuse = INV_PI * nDotL * lightColor;

    vec3 d = vec3(GGX(nDotH, u_roughness * u_roughness));
    vec3 g = vec3(CT_GeoAtten(nDotV, nDotH, vDotH, nDotL, lDotH));
    vec3 f0 = vec3(abs((1.0 - _RefractiveIndex) / (1.0 + _RefractiveIndex)));
    f0 = f0 * f0;
    f0 = mix(f0, materialColor, u_metallic);
    vec3 f = evaluateFresnelSchlick(vDotH, f0);
    diffuseOut = diffuseOut + (1.0 - saturate(f)) * (1.0 - u_metallic) * lightColor * diffuse;
    specularOut = specularOut + specAmount * lightColor * saturate((d * g * f) / saturate(4.0 * saturate(nDotH) * nDotV));
    debug = saturate(g);
}

void setParams(vec3 worldPosition,
    inout vec3 normal,
    inout vec3 view,
    inout float nDotV) {
  normal = normalize(normal);
  view = normalize(cameraPosition - worldPosition);
  nDotV = saturate(dot(normal, view));
}

void setLightParams(vec3 lightPosition,
    vec3 worldPosition,
    vec3 V,
    vec3 N,
    inout vec3 L,
    inout vec3 H,
    inout float nDotL,
    inout float nDotH,
    inout float vDotH,
    inout float lDotH) {
  L = normalize(lightPosition - worldPosition);
  H = normalize(L + V);

  nDotL = saturate(dot(N, L));
  nDotH = saturate(dot(N, H));
  vDotH = saturate(dot(V, H));
  lDotH = saturate(dot(L, H));
}

void main() {
  vec3 materialColor = u_color;

  vec4 outColorMult;
  vec3 normalisedNormal = v_normal;
  vec3 normalisedView;
  float nDotV;

  generatePapercraftColorNormal(v_normal, v_tangent, v_binormal, v_position, outColorMult, normalisedNormal);
  setParams(v_position, normalisedNormal, normalisedView, nDotV);

  vec3 normalisedLight;
  vec3 normalisedHalf;

  float nDotL;
  float nDotH;
  float vDotH;
  float lDotH;

  setLightParams(u_light0Pos, v_position, normalisedView, normalisedNormal,
      normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH);

  vec3 diffuse = vec3(0.0, 0.0, 0.0);
  vec3 specular = vec3(0.0, 0.0, 0.0);
  vec3 debug = vec3(0.0, 0.0, 0.0);

  evaluatePBRLight(materialColor * outColorMult.rgb, u_light0Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0);
  vec3 ambient = (1.0 - u_metallic) * materialColor * outColorMult.rgb * 0.0;

  setLightParams(u_light1Pos, v_position, normalisedView, normalisedNormal,
      normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH);
  evaluatePBRLight(materialColor * outColorMult.rgb, u_light1Color, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 1.0);

  vec3 R = -reflect(normalisedView, normalisedNormal);
  setLightParams(v_position + R, v_position, normalisedView, normalisedNormal,
      normalisedLight, normalisedHalf, nDotL, nDotH, vDotH, lDotH);
        vec3 envColor = mix(materialColor, vec3(1.0, 1.0, 1.0), 0.7);
  evaluatePBRLight(materialColor * outColorMult.rgb, envColor * environmentStrength, nDotL, nDotV, nDotH, vDotH, lDotH, diffuse, specular, debug, 0.25);
  gl_FragColor = vec4(specular + diffuse * materialColor, 1.0);
}