"use client";
import Link from "next/link";
import { useFactory } from "@/lib/store";
import { dayOfRun } from "@/lib/catalog";
import { release } from "@/lib/audio";
const COPY: Record<string, { title: string; body: string }> = {
  core: { title: "Agent Core", body: "Intent is specified here. Planning is separated from execution. Public architecture only." },
  mesh: { title: "Private Mesh Corridor", body: "Routing between owned nodes. No rented control plane." },
  vault: { title: "Sandbox Vault", body: "Drafts unfiled. Trade-secret boundary. Do not say patented." },
  ledger: { title: "Factory Ledger Rail", body: "193 specified systems. Estimates are planning labels. Selected is not Done." },
};
export function InterfaceOverlay() {
  const world = useFactory((s) => s.world);
  const setWorld = useFactory((s) => s.setWorld);
  const concepts = useFactory((s) => s.concepts);
  const selected = useFactory((s) => s.selected);
  const setSelected = useFactory((s) => s.setSelected);
  const query = useFactory((s) => s.query);
  const setQuery = useFactory((s) => s.setQuery);
  const hover = useFactory((s) => s.hover);
  const day = dayOfRun();
  const list = concepts.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || `${c.id} ${c.name} ${c.form} ${c.status}`.toLowerCase().includes(q);
  });
  return (
    <div className="overlay">
      <header className="hud">
        <div><div className="mark">::JH•TUAI::  MOVING WITH CLARITY</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Day {day}/21 · 193 specified · 1 operator</div></div>
        <nav>
          <button className={world === "idle" ? "on" : ""} onClick={() => { release(); setWorld("idle"); }}>Floor</button>
          <button className={world === "core" ? "on" : ""} onClick={() => setWorld("core")}>Core</button>
          <button className={world === "mesh" ? "on" : ""} onClick={() => setWorld("mesh")}>Mesh</button>
          <button className={world === "vault" ? "on" : ""} onClick={() => setWorld("vault")}>Vault</button>
          <button className={world === "ledger" ? "on" : ""} onClick={() => setWorld("ledger")}>Ledger</button>
          <Link href="/ledger">No-WebGL ledger</Link>
          <Link href="/godmode">/godmode</Link>
        </nav>
      </header>
      <div className="dock">
        <div className="legend">
          <h1>Factory floor.</h1>
          <p>A solo software factory documenting <b>193 systems</b> in 21 days. Select a unit. The camera inspects it. The overlay is the artifact.</p>
          <p className="muted" style={{ marginTop: 8 }}>{hover === "operator" ? "Operator entity — architectural machine, not a person." : hover ? `Locked on ${hover}.` : "Pointer steers the operator on desktop. Tap a unit on mobile."}</p>
        </div>
        <div className="statrow" style={{ minWidth: 280 }}>
          <div><b>{concepts.length || "—"}</b>specified</div>
          <div><b>{concepts.filter((c) => c.status === "Selected").length || "—"}</b>selected</div>
          <div><b>{concepts.filter((c) => c.companyCandidate).length || "—"}</b>company-shaped</div>
          <div><b>0</b>patents filed</div>
        </div>
      </div>
      {world !== "idle" && COPY[world] && (
        <aside className="panel" aria-live="polite">
          <p className="meta">{world} · inspect</p>
          <h2>{COPY[world].title}</h2>
          <p>{COPY[world].body}</p>
          {world === "vault" && (<><article><b>Allowed</b><p className="muted">draft provisional · invention disclosure · trade secret · hold</p></article><article><b>Forbidden</b><p className="muted">patented · USPTO-filed · JCH-2026 granted</p></article></>)}
          {world === "ledger" && (<><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="filter the rail…" />
            <table><thead><tr><th>ID</th><th>Name</th><th>Form</th><th>Team</th><th>Solo</th></tr></thead>
            <tbody>{list.slice(0, 80).map((c) => (<tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: "pointer" }}>
              <td>T21-{String(c.id).padStart(3, "0")}</td><td>{c.name}</td><td>{c.form}</td><td>{c.estimate.team}</td><td>{c.estimate.soloFactory}</td>
            </tr>))}</tbody></table>
            <p className="muted">{list.length} rows · planning estimates</p></>)}
          {selected && (<article><p className="meta">{selected.urn}</p><h3>{selected.name}</h3><p>{selected.why}</p><p className="muted">{selected.form} · {selected.status} · {selected.estimate.team} / {selected.estimate.soloFactory}</p></article>)}
          <button className="ghost" style={{ marginTop: 16 }} onClick={() => { release(); setWorld("idle"); }}>Release lock</button>
        </aside>
      )}
    </div>
  );
}
