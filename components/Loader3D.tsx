import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface Loader3DProps {
  progress: number;
}

// 3D simplex noise (Ashima Arts / Stefan Gustavson) untuk displacement shader.
const NOISE_GLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
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
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
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
`;

const Loader3D: React.FC<Loader3DProps> = ({ progress }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  // Simpan progress terbaru agar bisa dibaca di dalam animation loop.
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const colorCyan = new THREE.Color('#00f2fe');
    const colorViolet = new THREE.Color('#8b5cf6');

    // --- Icosahedron wireframe dengan distort shader ---
    const geometry = new THREE.IcosahedronGeometry(1.6, 12);
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorA: { value: colorCyan },
      uColorB: { value: colorViolet },
    };
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        varying float vNoise;
        ${NOISE_GLSL}
        void main() {
          float t = uTime * 0.35;
          float n = snoise(position * 1.1 + vec3(t));
          float amp = 0.18 + uProgress * 0.45;
          vec3 displaced = position + normalize(position) * n * amp;
          vNoise = n;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uProgress;
        varying float vNoise;
        void main() {
          float m = smoothstep(-1.0, 1.0, vNoise);
          vec3 col = mix(uColorA, uColorB, m);
          float glow = 1.1 + 0.6 * uProgress;
          gl_FragColor = vec4(col * glow, 1.0);
        }
      `,
    });
    const icosa = new THREE.Mesh(geometry, material);
    scene.add(icosa);

    // Inti solid tipis di dalam biar terasa "berisi".
    const coreMat = new THREE.MeshBasicMaterial({
      color: colorCyan,
      transparent: true,
      opacity: 0.12,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 3), coreMat);
    scene.add(core);

    // --- Partikel orbit ---
    const PARTICLE_COUNT = 1600;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 2.4 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      const c = Math.random() > 0.5 ? colorCyan : colorViolet;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Post-processing bloom ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.1, // strength
      0.6, // radius
      0.0  // threshold
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const p = progressRef.current / 100;

      uniforms.uTime.value = t;
      uniforms.uProgress.value = p;

      icosa.rotation.y = t * (0.3 + p * 0.6);
      icosa.rotation.x = t * 0.15;
      core.rotation.copy(icosa.rotation);

      particles.rotation.y = t * 0.08;
      particles.rotation.x = t * 0.04;

      bloom.strength = 0.9 + p * 0.9;

      // Kamera mengorbit halus.
      camera.position.x = Math.sin(t * 0.2) * 0.6;
      camera.position.y = Math.cos(t * 0.15) * 0.4;
      camera.lookAt(0, 0, 0);

      composer.render();
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      coreMat.dispose();
      core.geometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default Loader3D;
