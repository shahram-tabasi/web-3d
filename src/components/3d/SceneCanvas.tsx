'use client';

import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Props = { visible: boolean; compact: boolean; reduced: boolean; onFailure: () => void; onReady: () => void };
const sites: [number, number, number][] = [
  [-0.95, 0.65, 0.85], [0.1, 1.1, 0.9], [0.95, 0.5, 0.85],
  [1.1, -0.45, 0.65], [0.1, -0.6, 1.25], [-0.9, -0.4, 1],
];

function Connection({ from, to, reduced }: { from: number; to: number; reduced: boolean }) {
  const packet = useRef<THREE.Mesh>(null);
  const progress = useRef(from / sites.length);
  const curve = useMemo(() => {
    const a = new THREE.Vector3(...sites[from]).normalize().multiplyScalar(1.42);
    const b = new THREE.Vector3(...sites[to]).normalize().multiplyScalar(1.42);
    return new THREE.QuadraticBezierCurve3(a, a.clone().add(b).normalize().multiplyScalar(2.1), b);
  }, [from, to]);
  const points = useMemo(() => curve.getPoints(32), [curve]);
  useFrame((_, dt) => {
    if (!reduced) progress.current = (progress.current + Math.min(dt, 0.05) * 0.12) % 1;
    if (packet.current) curve.getPoint(progress.current, packet.current.position);
  });
  return <>
    <Line points={points} color="#55e6ff" lineWidth={1} transparent opacity={0.5} />
    <mesh ref={packet} position={curve.getPoint(progress.current)}>
      <sphereGeometry args={[0.022, 8, 6]} />
      <meshBasicMaterial color="#dcfbff" />
    </mesh>
  </>;
}

function IndustrialSite({ position, index, active, onActive }: {
  position: [number, number, number]; index: number; active: boolean; onActive: (index: number | null) => void;
}) {
  const location = useMemo(() => new THREE.Vector3(...position).normalize().multiplyScalar(1.42), [position]);
  const orientation = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), location.clone().normalize()), [location]);
  const enter = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onActive(index); };
  return <group position={location} quaternion={orientation} onPointerOver={enter} onPointerOut={() => onActive(null)}>
    <mesh position={[0, 0.025, 0]}>
      <cylinderGeometry args={[0.19, 0.22, 0.05, 6]} />
      <meshStandardMaterial color={active ? '#76edff' : '#184d65'} metalness={0.7} roughness={0.35} emissive="#2ad3f0" emissiveIntensity={active ? 1.2 : 0.2} />
    </mesh>
    {[0, 1, 2].map(tower => <mesh key={tower} position={[(tower - 1) * 0.09, 0.12 + tower * 0.025, 0]}>
      <boxGeometry args={[0.065, 0.15 + tower * 0.05, 0.11]} />
      <meshStandardMaterial color={active ? '#b5f4ff' : '#48859b'} metalness={0.75} roughness={0.3} emissive="#27b8e5" emissiveIntensity={active ? 0.8 : 0.1} />
    </mesh>)}
    <mesh position={[0, 0.37, 0]}>
      <sphereGeometry args={[active ? 0.055 : 0.035, 12, 8]} />
      <meshBasicMaterial color={active ? '#ffffff' : '#67eaff'} />
    </mesh>
  </group>;
}

function DigitalTwin({ compact, reduced }: Pick<Props, 'compact' | 'reduced'>) {
  const world = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState<number | null>(null);
  const { camera, gl, size } = useThree();

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
    if (reduced) return;
    const delta = Math.min(dt, 0.05);
    if (world.current) world.current.rotation.y += delta * 0.035;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.3, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.35 - pointer.current.y * 0.18, 3, delta);
    camera.lookAt(0, 0, 0);
  });

  return <>
    <color attach="background" args={['#050b18']} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 4, 5]} color="#b7e9ff" intensity={3} />
    <pointLight position={[-3, 1, -1]} color="#6856ff" intensity={16} />
    <pointLight position={[1, -2, 3]} color="#2ad3f0" intensity={8} />
    <group scale={compact ? 0.87 : size.width / size.height < 1.2 ? 1 : 1.15} rotation={[0.18, -0.35, -0.16]}>
      <group ref={world}>
        <mesh>
          <sphereGeometry args={[1.38, compact ? 32 : 64, compact ? 24 : 48]} />
          <meshStandardMaterial color="#092438" metalness={0.65} roughness={0.4} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.4, compact ? 20 : 36, compact ? 12 : 20]} />
          <meshBasicMaterial color="#3097b2" wireframe transparent opacity={0.2} />
        </mesh>
        {sites.map((position, index) => <IndustrialSite key={index} position={position} index={index} active={active === index} onActive={setActive} />)}
        {sites.map((_, index) => <Connection key={index} from={index} to={(index + 1) % sites.length} reduced={reduced} />)}
        {!compact && <><Connection from={0} to={3} reduced={reduced} /><Connection from={1} to={4} reduced={reduced} /><Connection from={2} to={5} reduced={reduced} /></>}
      </group>
      {[0, 1].map(index => <mesh key={index} rotation={[Math.PI / 2 + index * 0.45, index * 0.4, 0]}>
        <torusGeometry args={[1.95 + index * 0.18, 0.006, 6, compact ? 64 : 128]} />
        <meshBasicMaterial color={index ? '#6e6be8' : '#2ad3f0'} transparent opacity={0.45} />
      </mesh>)}
    </group>
  </>;
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
      dpr={compact ? 1 : [1, 1.5]}
      camera={{ position: [0, 0.35, 6.3], fov: 42 }}
      frameloop={!visible ? 'never' : reduced ? 'demand' : 'always'}
      gl={{ antialias: !compact, alpha: false, powerPreference: 'low-power' }}
      fallback={null}
      onCreated={({ camera }) => { camera.lookAt(0, 0, 0); setReady(true); onReady(); }}
    >
      <ContextGuard onFailure={onFailure} />
      <DigitalTwin compact={compact} reduced={reduced} />
    </Canvas>
  </div>;
}
