"use client";
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { World } from "@/lib/store";
const POSES: Record<World, { pos: [number, number, number]; look: [number, number, number] }> = {
  idle: { pos: [0, 1.15, 6.4], look: [0, 0.15, 0] },
  core: { pos: [-2.4, 1.1, 1.6], look: [-3.2, 0.4, -1.2] },
  mesh: { pos: [2.4, 1.05, 1.7], look: [3.3, 0.2, -1.1] },
  vault: { pos: [-1.4, 0.7, 3.6], look: [-2.4, -0.3, 1.8] },
  ledger: { pos: [1.6, 0.85, 3.8], look: [2.5, -0.5, 1.9] },
};
export function CameraDirector({ world, reduced }: { world: World; reduced: boolean }) {
  const { camera } = useThree();
  const look = useRef({ x: 0, y: 0.15, z: 0 });
  const first = useRef(true);
  useEffect(() => {
    const pose = POSES[world];
    if (reduced || first.current) {
      camera.position.set(...pose.pos);
      look.current = { x: pose.look[0], y: pose.look[1], z: pose.look[2] };
      camera.lookAt(look.current.x, look.current.y, look.current.z);
      first.current = false; return;
    }
    const tl = gsap.timeline();
    tl.to(camera.position, { x: pose.pos[0], y: pose.pos[1], z: pose.pos[2], duration: 1.15, ease: "power2.inOut" }, 0);
    tl.to(look.current, { x: pose.look[0], y: pose.look[1], z: pose.look[2], duration: 1.15, ease: "power2.inOut", onUpdate: () => camera.lookAt(look.current.x, look.current.y, look.current.z) }, 0);
    return () => { tl.kill(); };
  }, [world, camera, reduced]);
  return null;
}
