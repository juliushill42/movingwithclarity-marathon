"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFactory } from "@/lib/store";
import { loadCatalog } from "@/lib/catalog";
import { InterfaceOverlay } from "./InterfaceOverlay";
import { SceneBoundary } from "./SceneBoundary";

const FactoryScene = dynamic(() => import("./FactoryScene").then((m) => m.FactoryScene), { ssr: false });

export function FactoryExperience() {
  const setBooted = useFactory((s) => s.setBooted);
  const setFlags = useFactory((s) => s.setFlags);
  const setConcepts = useFactory((s) => s.setConcepts);
  const booted = useFactory((s) => s.booted);
  const webgl = useFactory((s) => s.webgl);
  const reduced = useFactory((s) => s.reduced);
  const mobile = useFactory((s) => s.mobile);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileView = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820;
    let gl = false;
    try {
      const c = document.createElement("canvas");
      gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      gl = false;
    }
    setFlags({ reduced: reducedMotion, mobile: mobileView, webgl: gl });
    setBooted(true);
    loadCatalog().then(setConcepts).catch(() => setConcepts([]));
  }, [setBooted, setFlags, setConcepts]);

  const show3d = booted && webgl && !reduced && !mobile;

  return (
    <>
      <div className="poster" aria-hidden />
      {show3d && (
        <SceneBoundary>
          <FactoryScene follow />
        </SceneBoundary>
      )}
      <InterfaceOverlay />
    </>
  );
}
