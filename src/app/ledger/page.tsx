"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dayOfRun, loadCatalog, type Concept } from "@/lib/catalog";

export default function LedgerPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Concept | null>(null);
  useEffect(() => {
    loadCatalog().then(setConcepts).catch(() => setConcepts([]));
  }, []);
  const list = concepts.filter((c) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return `${c.id} ${c.name} ${c.why} ${c.form} ${c.status}`.toLowerCase().includes(s);
  });
  return (
    <>
      <div className="poster" />
      <main className="page">
        <p className="mark">MOVING WITH CLARITY</p>
        <h1>The 193 systems</h1>
        <p className="muted">
          Day {dayOfRun()} of 21. September 22 to October 12, 2026. One person. Times are planning guesses.
        </p>
        <p>
          <Link href="/">Home</Link> · <Link href="/schedule">Schedule</Link>
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or idea…"
          style={{ width: "100%", background: "#0b0e13", border: "1px solid #2a323d", color: "#e8edf2", padding: 10, margin: "16px 0" }}
        />
        {open && (
          <section style={{ border: "1px solid #2a323d", padding: 16, marginBottom: 16 }}>
            <p className="muted">System {String(open.id).padStart(3, "0")}</p>
            <h2>{open.name}</h2>
            <p>{open.why}</p>
            <p className="muted">
              Kind: {open.form}. Status: {open.status}. Team guess: {open.estimate?.team}. One person:{" "}
              {open.estimate?.soloFactory}.
            </p>
          </section>
        )}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Kind</th>
              <th>Status</th>
              <th>Team guess</th>
              <th>One person</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} onClick={() => setOpen(c)} style={{ cursor: "pointer" }}>
                <td>{String(c.id).padStart(3, "0")}</td>
                <td>{c.name}</td>
                <td>{c.form}</td>
                <td>{c.status}</td>
                <td>{c.estimate?.team}</td>
                <td>{c.estimate?.soloFactory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
