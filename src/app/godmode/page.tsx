"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dayOfRun, loadCatalog, type Concept } from "@/lib/catalog";
export default function Godmode() {
  const [n, setN] = useState(0); const [sel, setSel] = useState(0);
  useEffect(() => { loadCatalog().then((c: Concept[]) => { setN(c.length); setSel(c.filter((x) => x.status === "Selected").length); }); }, []);
  return (<><div className="poster" /><main className="page" style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}>
    <p className="mark">/GODMODE</p><h1>Operator console.</h1>
    <pre className="muted" style={{ whiteSpace: "pre-wrap" }}>{`SITE        movingwithclarity.com\nRUN         2026-09-22 → 2026-10-12\nDAY         ${dayOfRun()} / 21\nSPECIFIED   ${n}\nSELECTED    ${sel}\nOPERATORS   1\nFILED       0\nSTACK       Next.js · R3F · GSAP · GLSL · Zustand`}</pre>
    <p><Link href="/">release → floor</Link> · <Link href="/ledger">ledger</Link></p>
  </main></>);
}
