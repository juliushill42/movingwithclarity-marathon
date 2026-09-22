"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFactory } from "@/lib/store";
import { loadCatalog } from "@/lib/catalog";
import { bootTick } from "@/lib/audio";
import { InterfaceOverlay } from "./InterfaceOverlay";

const FactoryScene = dynamic(() => import("./FactoryScene").then((m) => m.FactoryScene), { ssr: false });

const LINES = ["MWC / GODMODE","OPERATOR ENTITY ONLINE","CATALOG 193  LOCKED","PATENTS FILED  0","CAMERA DIRECTOR READY","FLOOR OPEN"];

export function FactoryExperience() {
  const setBooted = useFactory((s) => s.setBooted);
  const setFlags = useFactory((s) => s.setFlags);
  const setConcepts = useFactory((s) => s.setConcepts);
  const booted = useFactory((s) => s.booted);
  const webgl = useFactory((s) => s.webgl);
  const reduced = useFactory((s) => s.reduced);
  const mobile = useFactory((s) => s.mobile);
  const [line, setLine] = useState(0);
  const [ready3d, setReady3d] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileView = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820;
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch { gl = false; }
    setFlags({ reduced: reducedMotion, mobile: mobileView, webgl: gl });
    loadCatalog().then(setConcepts).catch(() => setConcepts([]));
    if (reducedMotion) { setBooted(true); return; }
    let i = 0;
    const id = window.setInterval(() => {
      bootTick(i); i += 1; setLine(i);
      if (i >= LINES.length) { window.clearInterval(id); setBooted(true); }
    }, 220);
    return () => window.clearInterval(id);
  }, [setBooted, setFlags, setConcepts]);

  useEffect(() => {
    if (!booted) return;
    const t = window.setTimeout(() => setReady3d(true), 80);
    return () => window.clearTimeout(t);
  }, [booted]);

  return (
    <>
      <div className="poster" aria-hidden />
      {!booted && <div className="boot" role="status"><pre>{LINES.slice(0, line).map((l) => `> ${l}`).join("\n")}</pre></div>}
      {booted && ready3d && webgl && !reduced && <FactoryScene follow={!mobile} />}
      {booted && <InterfaceOverlay />}
    </>
  );
}
