const SPECTRUM_FRAGMENT_SOURCE = [
  "precision highp float;",

  "const float PI = 3.14159265359;",
  "const float G = 9.81;",
  "const float KM = 370.0;",

  "varying vec2 v_coordinates;",

  "uniform float u_size;",
  "uniform float u_resolution;",

  "uniform sampler2D u_phases;",
  "uniform sampler2D u_initialSpectrum;",

  "uniform float u_choppiness;",

  "vec2 multiplyComplex (vec2 a, vec2 b) {",
  "return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);",
  "}",

  "vec2 multiplyByI (vec2 z) {",
  "return vec2(-z[1], z[0]);",
  "}",

  "float omega (float k) {",
  "return sqrt(G * k * (1.0 + k * k / KM * KM));",
  "}",

  "void main (void) {",
  "vec2 coordinates = gl_FragCoord.xy - 0.5;",
  "float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;",
  "float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;",
  "vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;",

  "float phase = texture2D(u_phases, v_coordinates).r;",
  "vec2 phaseVector = vec2(cos(phase), sin(phase));",

  "vec2 h0 = texture2D(u_initialSpectrum, v_coordinates).rg;",
  "vec2 h0Star = texture2D(u_initialSpectrum, vec2(1.0 - v_coordinates + 1.0 / u_resolution)).rg;",
  "h0Star.y *= -1.0;",

  "vec2 h = multiplyComplex(h0, phaseVector) + multiplyComplex(h0Star, vec2(phaseVector.x, -phaseVector.y));",

  "vec2 hX = -multiplyByI(h * (waveVector.x / length(waveVector))) * u_choppiness;",
  "vec2 hZ = -multiplyByI(h * (waveVector.y / length(waveVector))) * u_choppiness;",

  //no DC term
  "if (waveVector.x == 0.0 && waveVector.y == 0.0) {",
  "h = vec2(0.0);",
  "hX = vec2(0.0);",
  "hZ = vec2(0.0);",
  "}",

  "gl_FragColor = vec4(hX + multiplyByI(h), hZ);",
  "}",
].join("\n");

//cannot use common heightmap optimisations because displacements are horizontal as well as vertical
const NORMAL_MAP_FRAGMENT_SOURCE = [
  "precision highp float;",

  "varying vec2 v_coordinates;",

  "uniform sampler2D u_displacementMap;",
  "uniform float u_resolution;",
  "uniform float u_size;",

  "void main (void) {",
  "float texel = 1.0 / u_resolution;",
  "float texelSize = u_size / u_resolution;",

  "vec3 center = texture2D(u_displacementMap, v_coordinates).rgb;",
  "vec3 right = vec3(texelSize, 0.0, 0.0) + texture2D(u_displacementMap, v_coordinates + vec2(texel, 0.0)).rgb - center;",
  "vec3 left = vec3(-texelSize, 0.0, 0.0) + texture2D(u_displacementMap, v_coordinates + vec2(-texel, 0.0)).rgb - center;",
  "vec3 top = vec3(0.0, 0.0, -texelSize) + texture2D(u_displacementMap, v_coordinates + vec2(0.0, -texel)).rgb - center;",
  "vec3 bottom = vec3(0.0, 0.0, texelSize) + texture2D(u_displacementMap, v_coordinates + vec2(0.0, texel)).rgb - center;",

  "vec3 topRight = cross(right, top);",
  "vec3 topLeft = cross(top, left);",
  "vec3 bottomLeft = cross(left, bottom);",
  "vec3 bottomRight = cross(bottom, right);",

  "gl_FragColor = vec4(normalize(topRight + topLeft + bottomLeft + bottomRight), 1.0);",
  "}",
].join("\n");

const OCEAN_VERTEX_SOURCE = [
  "precision highp float;",

  "attribute vec3 a_position;",
  "attribute vec2 a_coordinates;",

  "varying vec3 v_position;",
  "varying vec2 v_coordinates;",

  "uniform mat4 u_projectionMatrix;",
  "uniform mat4 u_viewMatrix;",

  "uniform float u_size;",
  "uniform float u_geometrySize;",

  "uniform sampler2D u_displacementMap;",

  "void main (void) {",
  "vec3 position = a_position + texture2D(u_displacementMap, a_coordinates).rgb * (u_geometrySize / u_size);",

  "v_position = position;",
  "v_coordinates = a_coordinates;",

  "gl_Position = u_projectionMatrix * u_viewMatrix * vec4(position, 1.0);",
  "}",
].join("\n");

const OCEAN_FRAGMENT_SOURCE = [
  "precision highp float;",

  "varying vec2 v_coordinates;",
  "varying vec3 v_position;",

  "uniform sampler2D u_displacementMap;",
  "uniform sampler2D u_normalMap;",

  "uniform vec3 u_cameraPosition;",

  "uniform vec3 u_oceanColor;",
  "uniform vec3 u_skyColor;",
  "uniform float u_exposure;",

  "uniform vec3 u_sunDirection;",

  "vec3 hdr (vec3 color, float exposure) {",
  "return 1.0 - exp(-color * exposure);",
  "}",

  "void main (void) {",
  "vec3 normal = texture2D(u_normalMap, v_coordinates).rgb;",

  "vec3 view = normalize(u_cameraPosition - v_position);",
  "float fresnel = 0.02 + 0.98 * pow(1.0 - dot(normal, view), 5.0);",
  "vec3 sky = fresnel * u_skyColor;",

  "float diffuse = clamp(dot(normal, normalize(u_sunDirection)), 0.0, 1.0);",
  "vec3 water = (1.0 - fresnel) * u_oceanColor * u_skyColor * diffuse;",

  "vec3 color = sky + water;",

  "gl_FragColor = vec4(hdr(color, u_exposure), 1.0);",
  "}",
].join("\n");

export {
  OCEAN_FRAGMENT_SOURCE,
  OCEAN_VERTEX_SOURCE,
  NORMAL_MAP_FRAGMENT_SOURCE,
  SPECTRUM_FRAGMENT_SOURCE,
};
