"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFactory, type World } from "@/lib/store";
import { lock } from "@/lib/audio";
import { scanFrag, scanVert } from "./shaders";
function useMat(color: string, scan: number) {
  return useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uScan: { value: scan } },
    vertexShader: scanVert, fragmentShader: scanFrag,
  }), [color, scan]);
}
function tick(mat: THREE.ShaderMaterial, t: number) { mat.uniforms.uTime.value = t; }
export function AgentCore({ onPick }: { onPick: (w: World) => void }) {
  const mat = useMat("#7ee0e8", 1.2); const g = useRef<THREE.Group>(null);
  const hover = useFactory((s) => s.hover);
  useFrame((s) => { tick(mat, s.clock.elapsedTime); if (g.current) g.current.rotation.y = s.clock.elapsedTime * 0.15; });
  return (<group ref={g} position={[-3.2, 0.4, -1.2]} onPointerOver={() => useFactory.getState().setHover("core")} onPointerOut={() => useFactory.getState().setHover(null)} onClick={() => { lock(); onPick("core"); }}>
    <mesh material={mat} scale={hover === "core" ? 1.08 : 1}><boxGeometry args={[0.9, 0.9, 0.9]} /></mesh>
    <mesh material={mat}><boxGeometry args={[1.15, 0.06, 0.06]} /></mesh>
    <mesh material={mat}><boxGeometry args={[0.06, 1.15, 0.06]} /></mesh>
  </group>);
}
export function MeshCorridor({ onPick }: { onPick: (w: World) => void }) {
  const mat = useMat("#c5ced8", 0.6); const g = useRef<THREE.Group>(null);
  useFrame((s) => { tick(mat, s.clock.elapsedTime); if (g.current) g.current.position.z = -0.4 + Math.sin(s.clock.elapsedTime * 0.8) * 0.08; });
  return (<group ref={g} position={[3.3, 0.15, -1.1]} onPointerOver={() => useFactory.getState().setHover("mesh")} onPointerOut={() => useFactory.getState().setHover(null)} onClick={() => { lock(); onPick("mesh"); }}>
    {[-0.28, 0, 0.28].map((y) => <mesh key={y} position={[0, y, 0]} material={mat}><boxGeometry args={[1.8, 0.05, 0.12]} /></mesh>)}
    {[-0.6, 0, 0.6].map((x) => <mesh key={x} position={[x, 0, 0]} material={mat}><boxGeometry args={[0.05, 0.7, 0.12]} /></mesh>)}
  </group>);
}
export function SandboxVault({ onPick }: { onPick: (w: World) => void }) {
  const mat = useMat("#e8c07a", 0.25); const lid = useRef<THREE.Mesh>(null); const hover = useFactory((s) => s.hover);
  useFrame((s) => { tick(mat, s.clock.elapsedTime); if (lid.current) lid.current.position.y = 0.42 + (hover === "vault" ? 0.12 : 0); });
  return (<group position={[-2.4, -0.55, 1.8]} onPointerOver={() => useFactory.getState().setHover("vault")} onPointerOut={() => useFactory.getState().setHover(null)} onClick={() => { lock(); onPick("vault"); }}>
    <mesh material={mat}><boxGeometry args={[1.1, 0.7, 0.9]} /></mesh>
    <mesh ref={lid} position={[0, 0.42, 0]} material={mat}><boxGeometry args={[1.14, 0.08, 0.94]} /></mesh>
  </group>);
}
export function ArtifactConveyor({ onPick }: { onPick: (w: World) => void }) {
  const mat = useMat("#7ee0e8", 0.4); const rail = useRef<THREE.Group>(null);
  useFrame((s) => { tick(mat, s.clock.elapsedTime); if (rail.current) rail.current.children.forEach((ch, i) => { ch.position.x = ((s.clock.elapsedTime * 0.35 + i * 0.55) % 2.2) - 1.1; }); });
  return (<group position={[2.5, -0.7, 1.9]} onPointerOver={() => useFactory.getState().setHover("ledger")} onPointerOut={() => useFactory.getState().setHover(null)} onClick={() => { lock(); onPick("ledger"); }}>
    <mesh material={mat} position={[0, -0.18, 0]}><boxGeometry args={[2.4, 0.06, 0.5]} /></mesh>
    <group ref={rail}>{[0,1,2,3].map((i) => <mesh key={i} material={mat}><boxGeometry args={[0.34, 0.08, 0.28]} /></mesh>)}</group>
  </group>);
}
