export const scanVert = /* glsl */ `
  varying vec3 vPos; varying vec3 vN;
  void main() {
    vPos = position; vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
export const scanFrag = /* glsl */ `
  uniform float uTime; uniform vec3 uColor; uniform float uScan;
  varying vec3 vPos; varying vec3 vN;
  void main() {
    float light = pow(abs(dot(vN, normalize(vec3(0.2, 0.8, 0.5)))), 1.6);
    float band = fract(vPos.y * 2.4 - uTime * uScan);
    float scan = smoothstep(0.0, 0.08, band) * (1.0 - smoothstep(0.12, 0.22, band));
    vec3 chrome = mix(vec3(0.12, 0.14, 0.16), uColor, light * 0.65 + scan * 0.55);
    gl_FragColor = vec4(chrome, 1.0);
  }
`;
