"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dayOfRun, loadCatalog, type Concept } from "@/lib/catalog";

export default function StatusPage() {
  const [n, setN] = useState(0);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    loadCatalog()
      .then((c: Concept[]) => {
        setN(c.length);
        setSel(c.filter((x) => x.status === "Selected").length);
      })
      .catch(() => {});
  }, []);
  return (
    <>
      <div className="poster" />
      <main className="page">
        <p className="mark">MOVING WITH CLARITY</p>
        <h1>Run status</h1>
        <p>Day {dayOfRun()} of 21. {n || 193} systems written down. {sel} chosen to build first. One person.</p>
        <p>
          <Link href="/">Home</Link> · <Link href="/ledger">The 193 systems</Link>
        </p>
      </main>
    </>
  );
}
