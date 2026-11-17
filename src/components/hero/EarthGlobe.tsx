'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type World = { renderer: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.OrthographicCamera; earth: THREE.Mesh };

/** A cropped spherical Earth, aligned to the photograph's 1536 × 1024 composition. */
export default function EarthGlobe({ active }: { active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const world = useRef<World | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element || failed) return;
    let disposed = false;
    let observer: ResizeObserver | undefined;
    let renderer: THREE.WebGLRenderer | undefined;
    let geometry: THREE.SphereGeometry | undefined;
    let material: THREE.MeshStandardMaterial | undefined;
    let rimGeometry: THREE.SphereGeometry | undefined;
    let rimMaterial: THREE.ShaderMaterial | undefined;
    let texture: THREE.Texture | undefined;
    let lights: THREE.Texture | undefined;
    const lost = (event: Event) => { event.preventDefault(); setFailed(true); };
    const load = async () => {
      try {
        texture = await new THREE.TextureLoader().loadAsync('/hero/textures/earth-night.webp');
        if (disposed) { texture.dispose(); return; }
        lights = await new THREE.TextureLoader().loadAsync('/hero/textures/earth-lights.webp');
        if (disposed) { lights.dispose(); texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        lights.colorSpace = THREE.SRGBColorSpace;
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0, 0);
        renderer.domElement.addEventListener('webglcontextlost', lost);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        element.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-768, 768, 512, -512, 1, 10000);
        camera.position.z = 5000;
        geometry = new THREE.SphereGeometry(1450, 64, 40);
        material = new THREE.MeshStandardMaterial({ map: texture, emissiveMap: lights, emissive: '#ffe5b6', emissiveIntensity: 1.2, color: '#6983a5', roughness: 1, metalness: 0 });
        const earth = new THREE.Mesh(geometry, material);
        earth.position.y = -1698;
        earth.rotation.set(-0.25, -1.72, -0.12);
        scene.add(earth);
        scene.add(new THREE.AmbientLight('#809fc9', 1.6));
        const light = new THREE.DirectionalLight('#c2dfff', 2);
        light.position.set(-2000, 2500, 3000);
        scene.add(light);
        rimGeometry = new THREE.SphereGeometry(1454, 64, 40);
        rimMaterial = new THREE.ShaderMaterial({
          transparent: true, depthWrite: false,
          uniforms: { color: { value: new THREE.Color('#70b9eb') } },
          vertexShader: 'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
          fragmentShader: 'uniform vec3 color; varying vec3 n; varying vec3 v; void main(){float rim=pow(1.0-max(dot(normalize(n),normalize(v)),0.0),5.0);gl_FragColor=vec4(color,rim*0.42);}',
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.position.copy(earth.position);
        scene.add(rim);
        world.current = { renderer, scene, camera, earth };
        const resize = () => {
          if (!renderer || disposed) return;
          const { width, height } = element.getBoundingClientRect();
          if (!width || !height) return;
          const scale = Math.max(width / 1536, height / 1024);
          camera.left = -width / scale / 2; camera.right = width / scale / 2;
          camera.top = height / scale / 2; camera.bottom = -height / scale / 2;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          renderer.render(scene, camera);
        };
        observer = new ResizeObserver(resize);
        observer.observe(element);
        resize();
        setReady(true);
      } catch {
        if (!disposed) setFailed(true);
      }
    };
    void load();
    return () => {
      disposed = true;
      observer?.disconnect();
      world.current = null;
      renderer?.domElement.removeEventListener('webglcontextlost', lost);
      renderer?.domElement.remove();
      geometry?.dispose(); material?.dispose(); rimGeometry?.dispose(); rimMaterial?.dispose(); texture?.dispose(); lights?.dispose();
      renderer?.dispose();
    };
  }, [failed]);

  useEffect(() => {
    if (!active || !ready || failed) return;
    let frame = 0;
    let previous = 0;
    const draw = (time: number) => {
      const context = world.current;
      if (!context) return;
      if (time - previous >= 1000 / 30) {
        const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
        context.earth.rotation.y += delta * 0.018;
        context.renderer.render(context.scene, context.camera);
        previous = time;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [active, ready, failed]);

  if (failed) return null;
  return <div ref={host} data-earth-globe={ready ? 'ready' : 'loading'}
    className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />;
}
