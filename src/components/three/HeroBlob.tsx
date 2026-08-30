import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A softly animated "liquid mesh" rendered with a custom shader —
 * an icosahedron displaced by 3D simplex noise with fresnel-tinted
 * gradient colouring. Lazy-loaded (three.js is heavy) and only ever
 * mounted client-side.
 */

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying float vNoise;
varying vec3 vNormal2;
varying vec3 vView;

// --- ashima 3D simplex noise (public domain) ---
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  float t = uTime * 0.25;
  float n = snoise(normal * 1.4 + vec3(t, t * 0.8, t * 0.6));
  float n2 = snoise(normal * 3.5 - vec3(t * 0.7)) * 0.35;
  vNoise = n + n2;
  vec3 displaced = position + normal * vNoise * uAmp;
  vNormal2 = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
varying float vNoise;
varying vec3 vNormal2;
varying vec3 vView;

void main() {
  vec3 n = normalize(vNormal2);
  vec3 v = normalize(vView);
  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.2);
  float blend = smoothstep(-0.6, 0.9, vNoise);
  vec3 base = mix(uColorA, uColorB, blend);
  vec3 color = mix(base, uColorC, fresnel);
  // soft top-light
  color += vec3(0.06) * max(dot(n, normalize(vec3(0.4, 0.8, 0.4))), 0.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

function Blob({ dark, animate }: { dark: boolean; animate: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.32 },
      uColorA: { value: new THREE.Color(dark ? "#1d4ed8" : "#2563eb") },
      uColorB: { value: new THREE.Color(dark ? "#0ea5a4" : "#14b8a6") },
      uColorC: { value: new THREE.Color(dark ? "#93c5fd" : "#dbeafe") },
    }),
    [dark],
  );

  useFrame(({ clock }) => {
    if (!animate) return;
    if (material.current) material.current.uniforms.uTime!.value = clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.y = clock.elapsedTime * 0.08;
      mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.15;
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial ref={material} vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={uniforms} />
    </mesh>
  );
}

export default function HeroBlob({ dark }: { dark: boolean }) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={reduced ? "demand" : "always"}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Blob dark={dark} animate={!reduced} />
    </Canvas>
  );
}
