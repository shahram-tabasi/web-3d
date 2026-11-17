'use client';

import { Line, RoundedBox } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type Point = [number, number, number];
const palette = { steel: '#8b9eaf', dark: '#283440', wall: '#566572', cyan: '#7ce6ed', amber: '#ffd298' };

function Block({ at, size, color = palette.wall, metal = 0.65, glow = false, radius = 0.025 }: {
  at: Point; size: Point; color?: string; metal?: number; glow?: boolean; radius?: number;
}) {
  return <RoundedBox position={at} args={size} radius={radius} smoothness={2} castShadow receiveShadow>
    <meshStandardMaterial color={color} metalness={metal} roughness={glow ? 0.4 : 0.32} emissive={glow ? color : '#000000'} emissiveIntensity={glow ? 1.8 : 0} />
  </RoundedBox>;
}

function Pipe({ points, color = palette.steel, radius = 0.035 }: { points: Point[]; color?: string; radius?: number }) {
  const path = useMemo(() => new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)), false, 'catmullrom', 0.1), [points]);
  return <mesh castShadow>
    <tubeGeometry args={[path, 24, radius, 8, false]} />
    <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
  </mesh>;
}

/** Each equipment group shares a restrained highlight instead of changing the whole scene. */
function Equipment({ children, position }: { children: React.ReactNode; position: Point }) {
  const [hovered, setHovered] = useState(false);
  const hover = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); setHovered(true); };
  return <group position={position} onPointerOver={hover} onPointerOut={() => setHovered(false)}>
    {children}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
      <ringGeometry args={[0.79, 0.81, 48]} />
      <meshBasicMaterial color={palette.cyan} transparent opacity={hovered ? 0.85 : 0.08} depthWrite={false} />
    </mesh>
    {hovered && <pointLight position={[0, 1.7, 0.4]} color={palette.cyan} intensity={3} distance={3} />}
  </group>;
}

function ProductionHall({ compact }: { compact: boolean }) {
  return <Equipment position={[-0.75, 0, -0.6]}>
    <Block at={[0, 0.57, 0]} size={[2.65, 1.1, 1.7]} color="#68747e" />
    {/* Three sawtooth roof bays with clerestory glazing. */}
    {[0, 1, 2].map(bay => <group key={bay} position={[-0.88 + bay * 0.88, 1.13, 0]}>
      <mesh rotation={[0, 0, 0.12]} castShadow>
        <boxGeometry args={[0.89, 0.075, 1.83]} />
        <meshStandardMaterial color="#a8b7bf" metalness={0.85} roughness={0.25} />
      </mesh>
      <Block at={[-0.39, -0.035, 0]} size={[0.035, 0.16, 1.6]} color="#9edce4" metal={0.35} glow />
      {!compact && [0, 1, 2, 3, 4].map(rib => <Block key={rib} at={[0, 0.06, -0.76 + rib * 0.38]} size={[0.85, 0.015, 0.017]} color="#4b5e6e" radius={0.004} />)}
    </group>)}
    {/* Facade mullions, loading doors, and warm internal work lights. */}
    {[0, 1, 2, 3, 4, 5, 6].map(index => <Block key={index} at={[-1.2 + index * 0.4, 0.57, 0.86]} size={[0.035, 1.05, 0.035]} color="#b3bfc7" radius={0.005} />)}
    {[-0.8, 0, 0.8].map(x => <group key={x}>
      <Block at={[x, 0.4, 0.88]} size={[0.52, 0.65, 0.035]} color="#18222d" />
      <Block at={[x, 0.91, 0.89]} size={[0.55, 0.1, 0.025]} color={palette.amber} glow />
      {!compact && [0, 1, 2, 3].map(slat => <Block key={slat} at={[x, 0.18 + slat * 0.13, 0.904]} size={[0.49, 0.012, 0.008]} color="#73818b" radius={0.002} />)}
    </group>)}
    <Block at={[-1.34, 0.65, 0]} size={[0.03, 0.35, 1.35]} color="#173039" />
    <Block at={[-1.36, 0.7, 0]} size={[0.015, 0.045, 1.1]} color={palette.cyan} glow />
    <Block at={[0, 0.06, 1.02]} size={[2.85, 0.1, 0.38]} color="#3d4d5a" />
  </Equipment>;
}

function Tank({ x, z, compact }: { x: number; z: number; compact: boolean }) {
  return <group position={[x, 0, z]}>
    <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.48, 0.5, 0.18, compact ? 20 : 40]} />
      <meshStandardMaterial color="#3f5263" metalness={0.65} roughness={0.38} />
    </mesh>
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.39, 0.39, 1.32, compact ? 24 : 48]} />
      <meshStandardMaterial color="#a3b5c1" metalness={0.92} roughness={0.23} />
    </mesh>
    <mesh position={[0, 1.46, 0]} castShadow>
      <sphereGeometry args={[0.39, compact ? 20 : 40, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#bdc9d0" metalness={0.92} roughness={0.22} />
    </mesh>
    {[0.25, 1.21].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.4, 0.018, 6, compact ? 24 : 48]} />
      <meshStandardMaterial color="#495c70" metalness={0.8} roughness={0.3} />
    </mesh>)}
    <Block at={[0, 0.65, 0.395]} size={[0.025, 0.75, 0.012]} color={palette.cyan} glow radius={0.005} />
  </group>;
}

function ControlBuilding() {
  return <Equipment position={[1.4, 0, 1.25]}>
    <Block at={[0, 0.31, 0]} size={[1.65, 0.6, 0.85]} color="#647681" />
    <Block at={[0, 0.84, 0]} size={[1.6, 0.43, 0.81]} color="#122c38" metal={0.3} />
    <Block at={[0, 1.08, 0]} size={[1.8, 0.08, 1]} color="#b9c4ca" />
    {[-0.65, -0.32, 0, 0.32, 0.65].map(x => <Block key={x} at={[x, 0.84, 0.417]} size={[0.018, 0.43, 0.023]} color="#728d9f" radius={0.004} />)}
    <Block at={[0, 0.64, 0.425]} size={[1.55, 0.025, 0.018]} color={palette.amber} glow radius={0.005} />
    <Block at={[0, 0.11, 0.53]} size={[1.85, 0.2, 0.24]} color="#3d4e60" />
    <Block at={[0.45, 1.18, -0.13]} size={[0.5, 0.16, 0.32]} color="#435461" />
    <mesh position={[-0.55, 1.39, -0.15]}>
      <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
      <meshStandardMaterial color={palette.steel} metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh position={[-0.55, 1.68, -0.15]}>
      <sphereGeometry args={[0.032, 10, 8]} />
      <meshBasicMaterial color={palette.cyan} />
    </mesh>
  </Equipment>;
}

const dataRoutes: Point[][] = [
  [[-1.8, 0.05, 0.65], [-1.8, 0.05, 1.4], [0.2, 0.05, 1.4], [0.2, 0.05, 0.35], [1.5, 0.05, 0.35]],
  [[1.7, 0.05, -1.8], [2.65, 0.05, -1.8], [2.65, 0.05, 0.4], [1.5, 0.05, 0.4]],
];

function DataRoute({ points, reduced, index }: { points: Point[]; reduced: boolean; index: number }) {
  const marker = useRef<THREE.Mesh>(null);
  const progress = useRef(index * 0.4);
  const path = useMemo(() => {
    const curve = new THREE.CurvePath<THREE.Vector3>();
    points.slice(1).forEach((point, i) => curve.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]), new THREE.Vector3(...point))));
    return curve;
  }, [points]);
  useFrame((_, dt) => {
    if (!reduced) progress.current = (progress.current + Math.min(dt, 0.05) * 0.07) % 1;
    if (marker.current) marker.current.position.copy(path.getPoint(progress.current));
  });
  return <>
    <Line points={points} color="#69ccdb" lineWidth={1} transparent opacity={0.35} />
    <mesh ref={marker} position={path.getPoint(progress.current)}>
      <sphereGeometry args={[0.028, 8, 6]} />
      <meshBasicMaterial color="#d6ffff" />
    </mesh>
  </>;
}

export function IndustrialCampus({ compact, reduced }: { compact: boolean; reduced: boolean }) {
  return <group position={[0, -0.65, 0]}>
    {/* A single machined plinth anchors every asset and receives real shadows. */}
    <Block at={[0, -0.24, 0]} size={[6.4, 0.38, 4.8]} color="#172735" radius={0.14} />
    <Block at={[0, -0.035, 0]} size={[6.24, 0.05, 4.64]} color="#475866" metal={0.7} radius={0.09} />
    <Block at={[0, 0, 0]} size={[6.12, 0.04, 4.52]} color="#263845" metal={0.45} radius={0.07} />
    <Block at={[0, -0.18, 2.405]} size={[4.9, 0.015, 0.012]} color={palette.cyan} glow radius={0.004} />
    {/* A service road separates the production and control zones. */}
    <Block at={[0, 0.025, 0.65]} size={[5.8, 0.015, 0.45]} color="#17232e" metal={0.1} radius={0.004} />
    {[-2.5, -1.7, -0.9, -0.1, 0.7, 1.5, 2.3].map(x => <Block key={x} at={[x, 0.035, 0.65]} size={[0.28, 0.008, 0.015]} color="#c5b796" metal={0} radius={0.002} />)}
    <ProductionHall compact={compact} />
    <Equipment position={[1.65, 0, -1.05]}>
      <Tank x={-0.45} z={0} compact={compact} />
      <Tank x={0.5} z={0} compact={compact} />
      <Pipe points={[[-0.45, 1.72, 0], [-0.45, 2, 0], [0.5, 2, 0], [0.5, 1.72, 0]]} />
    </Equipment>
    <ControlBuilding />
    {/* Utility gantry and parallel process pipes connect both ends of the site. */}
    {[-0.45, 0.45].map(z => <Pipe key={z} points={[[-0.1, 0.12, -1.6 + z * 0.3], [-0.1, 1.6, -1.6 + z * 0.3], [0.6, 1.6, -1.6 + z * 0.3], [1.25, 1.6, -1.6 + z * 0.3], [1.25, 0.3, -1.6 + z * 0.3]]} radius={0.045} />)}
    <Equipment position={[-1.75, 0, 1.55]}>
      {[-0.45, 0, 0.45].map(x => <group key={x}>
        <Block at={[x, 0.35, 0]} size={[0.37, 0.65, 0.48]} color="#7f909c" />
        <Block at={[x, 0.46, 0.25]} size={[0.2, 0.14, 0.012]} color="#142c38" />
        <Block at={[x, 0.47, 0.26]} size={[0.11, 0.025, 0.008]} color={palette.cyan} glow radius={0.002} />
      </group>)}
    </Equipment>
    {dataRoutes.map((points, index) => <DataRoute key={index} points={points} reduced={reduced} index={index} />)}
    {!compact && [-2.8, 2.8].map(x => <group key={x}>
      <Block at={[x, 0.42, -2]} size={[0.025, 0.8, 0.025]} color={palette.steel} radius={0.005} />
      <Block at={[x, 0.84, -1.94]} size={[0.16, 0.035, 0.18]} color={palette.amber} glow />
    </group>)}
  </group>;
}
