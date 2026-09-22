"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { dayOfRun, loadCatalog, type Concept } from "@/lib/catalog";
export default function LedgerPage() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Concept | null>(null);
  useEffect(() => { loadCatalog().then(setConcepts); }, []);
  const list = concepts.filter((c) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return `${c.id} ${c.name} ${c.form} ${c.status} ${c.gate}`.toLowerCase().includes(s);
  });
  return (<><div className="poster" /><main className="page">
    <p className="mark">LEDGER RAIL · NO WEBGL REQUIRED</p>
    <h1>193 specified systems.</h1>
    <p className="muted">Day {dayOfRun()}/21 · planning estimates · Selected ≠ Done · 0 patents filed</p>
    <p><Link href="/">← factory floor</Link></p>
    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="filter…" style={{ width:"100%", background:"#0b0e13", border:"1px solid #2a323d", color:"#e8edf2", padding:10, margin:"16px 0" }} />
    {open && (<section><p className="meta muted">{open.urn}</p><h2>{open.name}</h2><p>{open.why}</p>
      <p className="muted">{open.form} · {open.status} · team {open.estimate.team} · solo {open.estimate.soloFactory}</p></section>)}
    <table><thead><tr><th>ID</th><th>Name</th><th>Form</th><th>Status</th><th>Team</th><th>Solo</th></tr></thead>
    <tbody>{list.map((c) => (<tr key={c.id} onClick={() => setOpen(c)} style={{ cursor:"pointer" }}>
      <td>T21-{String(c.id).padStart(3,"0")}</td><td>{c.name}</td><td>{c.form}</td><td>{c.status}</td><td>{c.estimate.team}</td><td>{c.estimate.soloFactory}</td>
    </tr>))}</tbody></table>
  </main></>);
}
