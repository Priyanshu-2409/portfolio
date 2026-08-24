"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { scrollState } from "@/lib/scroll";

/** Deterministic pseudo-random so the layout is identical every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEEP = "#1b2a4a";
const LINE = "#7c9bdb";

type Quality = "high" | "low";

function NetworkKnot({ quality, animate }: { quality: Quality; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const idle = useRef(0);
  const smoothP = useRef(0);

  const { nodes, nodeLines, knotArgs } = useMemo(() => {
    const rand = mulberry32(2409); // seeded with the GitHub handle number
    const count = quality === "high" ? 11 : 7;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = 2.1 + rand() * 0.7;
      pts.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.75,
          r * Math.cos(phi)
        )
      );
    }

    const linePts: number[] = [];
    pts.forEach((p, i) => {
      let nearest = -1;
      let best = Infinity;
      pts.forEach((q, j) => {
        if (i === j) return;
        const d = p.distanceToSquared(q);
        if (d < best) {
          best = d;
          nearest = j;
        }
      });
      if (nearest > i) {
        linePts.push(p.x, p.y, p.z, pts[nearest].x, pts[nearest].y, pts[nearest].z);
      }
      const inner = p.clone().normalize().multiplyScalar(1.35);
      linePts.push(p.x, p.y, p.z, inner.x, inner.y, inner.z);
    });

    const knotArgs: [number, number, number, number] =
      quality === "high" ? [1, 0.3, 140, 18] : [1, 0.3, 72, 10];

    return { nodes: pts, nodeLines: new Float32Array(linePts), knotArgs };
  }, [quality]);

  useFrame((state, delta) => {
    if (!group.current || !animate) return;
    const d = Math.min(delta, 0.05); // clamp after tab-switch jumps

    // Damped scroll progress: the scene chases the scrollbar with a little
    // weight instead of being rigidly glued to it (the "Apple feel").
    const k = 1 - Math.exp(-d * 7);
    smoothP.current += (scrollState.p - smoothP.current) * k;
    const p = smoothP.current;

    // Idle drift + scroll-driven extra rotation (~1.4 turns over the track)
    idle.current += d * 0.14;
    group.current.rotation.y = idle.current + p * Math.PI * 2.8;
    group.current.rotation.x =
      Math.sin(group.current.rotation.y * 0.5) * 0.12 + p * 0.3;

    // Scroll grows the whole system slightly and dollies the camera in —
    // gently enough that the knot stays inside the (bled) canvas
    group.current.scale.setScalar(1 + p * 0.08);
    state.camera.position.z = 5.6 - p * 0.85;

    // Wireframe and network lines brighten as you push in
    if (wireMat.current) wireMat.current.opacity = 0.28 + p * 0.3;
    if (lineMat.current) lineMat.current.opacity = 0.18 + p * 0.22;
  });

  return (
    <group ref={group} rotation={[0.35, 0.4, 0]}>
      {/* solid body in the deep accent */}
      <mesh>
        <torusKnotGeometry args={knotArgs} />
        <meshStandardMaterial color={DEEP} flatShading roughness={0.55} metalness={0.35} />
      </mesh>
      {/* wireframe overlay in the light accent */}
      <mesh scale={1.002}>
        <torusKnotGeometry args={knotArgs} />
        <meshBasicMaterial ref={wireMat} color={LINE} wireframe transparent opacity={0.28} />
      </mesh>

      {/* connecting lines between nodes and toward the knot */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodeLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMat}
          color={LINE}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* floating vertex points */}
      {nodes.map((p, i) =>
        quality === "high" && animate ? (
          <Float key={i} speed={1.2} rotationIntensity={0} floatIntensity={0.35} floatingRange={[-0.08, 0.08]}>
            <mesh position={p}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial color={LINE} transparent opacity={0.85} />
            </mesh>
          </Float>
        ) : (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={LINE} transparent opacity={0.85} />
          </mesh>
        )
      )}
    </group>
  );
}

export default function Scene({
  quality,
  animate,
  dpr,
  onReady,
}: {
  quality: Quality;
  animate: boolean;
  dpr: [number, number];
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={dpr}
      frameloop={animate ? "always" : "demand"}
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={onReady}
      style={{ pointerEvents: "none" }} // never interactive — no drag, no scroll traps
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 6]} intensity={1.4} color="#c9d8f5" />
      <directionalLight position={[-5, -3, -4]} intensity={0.4} color="#7c9bdb" />
      <NetworkKnot quality={quality} animate={animate} />
    </Canvas>
  );
}
