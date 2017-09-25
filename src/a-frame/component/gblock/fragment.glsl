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
