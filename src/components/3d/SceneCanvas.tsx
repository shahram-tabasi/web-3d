'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IndustrialCampus } from './IndustrialCampus';

type Props = { visible: boolean; compact: boolean; reduced: boolean; onFailure: () => void; onReady: () => void };
const lookAt = new THREE.Vector3(0, -0.2, 0);

function RenderBudget({ visible, reduced }: Pick<Props, 'visible' | 'reduced'>) {
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    if (!visible || reduced) return;
    const timer = window.setInterval(() => invalidate(), 1000 / 30);
    return () => window.clearInterval(timer);
  }, [visible, reduced, invalidate]);
  return null;
}

function CameraRig({ compact, reduced }: Pick<Props, 'compact' | 'reduced'>) {
  const pointer = useRef({ x: 0, y: 0 });
  const { camera, gl, size, invalidate } = useThree();
  const distance = (compact ? 1 : 1.18) * Math.max(1, 0.9 / (size.width / size.height));
  useEffect(() => {
    camera.position.set(7.4 * distance, 6.1 * distance, 8.6 * distance);
    camera.lookAt(lookAt);
    invalidate();
  }, [camera, distance, invalidate]);

  useEffect(() => {
    const section = gl.domElement.closest('section');
    if (!section || reduced || compact) return;
    const move = (event: Event) => {
      const e = event as PointerEvent;
      if (e.pointerType !== 'mouse') return;
      const bounds = section.getBoundingClientRect();
      pointer.current = {
        x: THREE.MathUtils.clamp(((e.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1),
        y: THREE.MathUtils.clamp(((e.clientY - bounds.top) / bounds.height - 0.5) * 2, -1, 1),
      };
    };
    const reset = () => { pointer.current = { x: 0, y: 0 }; };
    section.addEventListener('pointermove', move);
    section.addEventListener('pointerleave', reset);
    return () => { section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', reset); reset(); };
  }, [gl, compact, reduced]);

  useFrame((_, dt) => {
    if (reduced || compact) return;
    const delta = Math.min(dt, 0.05);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, 7.4 * distance + pointer.current.x * 0.35, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 6.1 * distance - pointer.current.y * 0.2, 2.5, delta);
    camera.lookAt(lookAt);
  });
  return null;
}

function ContextGuard({ onFailure }: Pick<Props, 'onFailure'>) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

export default function SceneCanvas({ visible, compact, reduced, onFailure, onReady }: Props) {
  const [ready, setReady] = useState(false);
  return <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
    <Canvas
      shadows={compact ? false : 'soft'}
      dpr={compact ? 1 : [1, 1.5]}
      camera={{ position: [7.4, 6.1, 8.6], fov: 35, near: 0.1, far: 60 }}
      frameloop={visible ? 'demand' : 'never'}
      gl={{ antialias: !compact, alpha: true, powerPreference: 'low-power' }}
      fallback={null}
      onCreated={({ camera }) => { camera.lookAt(lookAt); setReady(true); onReady(); }}
    >
      <ContextGuard onFailure={onFailure} />
      <RenderBudget visible={visible} reduced={reduced} />
      <CameraRig compact={compact} reduced={reduced} />
      <ambientLight intensity={0.45} color="#a6bfd6" />
      <directionalLight position={[-3, 7, 4]} color="#fff0d6" intensity={3.2} castShadow={!compact}
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-5} shadow-camera-right={5}
        shadow-camera-top={5} shadow-camera-bottom={-5} shadow-normalBias={0.03} />
      <directionalLight position={[4, 3, -4]} color="#80d5ff" intensity={2.4} />
      <Environment resolution={compact ? 32 : 64} frames={1}>
        <Lightformer position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 5, 1]} intensity={3} color="#f2f5ff" />
        <Lightformer position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[3, 5, 1]} intensity={2} color="#98d8ff" />
        <Lightformer position={[3, 2, 4]} rotation={[0, Math.PI, 0]} scale={[4, 2, 1]} intensity={2} color="#ffe4c2" />
      </Environment>
      <IndustrialCampus compact={compact} reduced={reduced} />
    </Canvas>
  </div>;
}
