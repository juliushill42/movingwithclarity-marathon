"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scanFrag, scanVert } from "./shaders";
import { useFactory } from "@/lib/store";
export function OperatorAvatar({ follow }: { follow: boolean }) {
  const group = useRef<THREE.Group>(null);
  const eye = useRef<THREE.Mesh>(null);
  const mats = useMemo(() => {
    const mk = (color: string, scan: number) => new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uScan: { value: scan } },
      vertexShader: scanVert, fragmentShader: scanFrag,
    });
    return { body: mk("#9aa7b3", 0.35), core: mk("#7ee0e8", 0.9), limb: mk("#c5ced8", 0.2) };
  }, []);
  const target = useRef(new THREE.Vector2(0, 0));
  const hover = useFactory((s) => s.hover);
  const world = useFactory((s) => s.world);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    Object.values(mats).forEach((m) => (m.uniforms.uTime.value = t));
    if (!group.current) return;
    if (follow && world === "idle") {
      target.current.lerp(new THREE.Vector2(state.pointer.x, state.pointer.y), 0.08);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, target.current.x * 0.6, 0.08);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -target.current.y * 0.28, 0.08);
    } else {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0.15, 0.06);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.05, 0.06);
    }
    group.current.position.y = Math.sin(t * 0.7) * 0.06;
    if (eye.current) eye.current.scale.setScalar(THREE.MathUtils.lerp(eye.current.scale.x, hover === "operator" ? 1.08 : 1, 0.1));
  });
  return (
    <group ref={group} position={[0, 0.2, 0]}>
      <mesh material={mats.body}><boxGeometry args={[0.9, 1.35, 0.55]} /></mesh>
      <mesh position={[0, 0.95, 0]} material={mats.body}><boxGeometry args={[0.7, 0.38, 0.48]} /></mesh>
      <mesh ref={eye} position={[0, 0.22, 0.3]} material={mats.core}><octahedronGeometry args={[0.18, 0]} /></mesh>
      <mesh position={[-0.62, 0.35, 0]} rotation={[0, 0, 0.4]} material={mats.limb}><boxGeometry args={[0.18, 0.95, 0.18]} /></mesh>
      <mesh position={[0.62, 0.35, 0]} rotation={[0, 0, -0.4]} material={mats.limb}><boxGeometry args={[0.18, 0.95, 0.18]} /></mesh>
      <mesh position={[-0.22, -0.95, 0]} material={mats.limb}><boxGeometry args={[0.2, 0.7, 0.2]} /></mesh>
      <mesh position={[0.22, -0.95, 0]} material={mats.limb}><boxGeometry args={[0.2, 0.7, 0.2]} /></mesh>
      {[0,1,2,3,4,5].map((i) => <OrbitBit key={i} i={i} mat={mats.core} />)}
    </group>
  );
}
function OrbitBit({ i, mat }: { i: number; mat: THREE.ShaderMaterial }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime * 0.35 + i * 1.047;
    if (ref.current) ref.current.position.set(Math.cos(t) * 1.35, Math.sin(t * 0.7) * 0.35, Math.sin(t) * 0.74);
  });
  return <mesh ref={ref} material={mat}><boxGeometry args={[0.07, 0.07, 0.07]} /></mesh>;
}
