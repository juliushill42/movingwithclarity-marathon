"use client";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useEffect } from "react";
import { OperatorAvatar } from "./OperatorAvatar";
import { AgentCore, ArtifactConveyor, MeshCorridor, SandboxVault } from "./Systems";
import { CameraDirector } from "./CameraDirector";
import { useFactory, type World } from "@/lib/store";

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]} receiveShadow>
      <planeGeometry args={[28, 28]} />
      <meshStandardMaterial color="#0a0c10" metalness={0.35} roughness={0.7} />
    </mesh>
  );
}
function VisibilityHalt() {
  const { gl } = useThree();
  useEffect(() => {
    const onVis = () => { gl.setAnimationLoop(document.hidden ? null : undefined); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [gl]);
  return null;
}
export function FactoryScene({ follow }: { follow: boolean }) {
  const world = useFactory((s) => s.world);
  const reduced = useFactory((s) => s.reduced);
  const setWorld = useFactory((s) => s.setWorld);
  const pick = (w: World) => setWorld(world === w ? "idle" : w);
  return (
    <Canvas dpr={[1, follow ? 1.6 : 1.15]} camera={{ position: [0, 1.15, 6.4], fov: 42, near: 0.1, far: 40 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} style={{ position: "fixed", inset: 0, zIndex: 1 }}>
      <color attach="background" args={["#050608"]} />
      <fog attach="fog" args={["#050608", 8, 18]} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 6, 3]} intensity={1.15} color="#d7e2ea" />
      <pointLight position={[0, 1.4, 1.2]} intensity={0.55} color="#7ee0e8" />
      <VisibilityHalt />
      <CameraDirector world={world} reduced={reduced} />
      <OperatorAvatar follow={follow} />
      <AgentCore onPick={pick} />
      <MeshCorridor onPick={pick} />
      <SandboxVault onPick={pick} />
      <ArtifactConveyor onPick={pick} />
      <Floor />
      <ContactShadows position={[0, -1.14, 0]} opacity={0.45} scale={14} blur={2.2} far={4} />
    </Canvas>
  );
}
