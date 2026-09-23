"use client";
import Link from "next/link";
import { useFactory } from "@/lib/store";
import { dayOfRun } from "@/lib/catalog";
import { todayPlan } from "@/lib/schedule";

export function InterfaceOverlay() {
  const world = useFactory((s) => s.world);
  const setWorld = useFactory((s) => s.setWorld);
  const concepts = useFactory((s) => s.concepts);
  const selected = useFactory((s) => s.selected);
  const setSelected = useFactory((s) => s.setSelected);
  const query = useFactory((s) => s.query);
  const setQuery = useFactory((s) => s.setQuery);
  const day = dayOfRun();
  const today = todayPlan();
  const list = concepts.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || `${c.id} ${c.name} ${c.why} ${c.form} ${c.status}`.toLowerCase().includes(q);
  });
  const selectedCount = concepts.filter((c) => c.status === "Selected").length;

  return (
    <div className="overlay">
      <header className="hud">
        <div>
          <div className="mark">MOVING WITH CLARITY</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Day {day} of 21 · Sep 22 – Oct 12, 2026 · one person, in public
          </div>
        </div>
        <nav>
          <button className={world === "idle" ? "on" : ""} onClick={() => setWorld("idle")}>
            Home
          </button>
          <button className={world === "ledger" ? "on" : ""} onClick={() => setWorld("ledger")}>
            The 193 systems
          </button>
          <Link href="/schedule">Schedule</Link>
          <Link href="/ledger">Full list</Link>
        </nav>
      </header>

      <div className="dock">
        <div className="legend">
          <h1>One person. 193 systems. 21 days.</h1>
          <p>
            A public build log. Each item says what it is and why it exists. Time notes are planning
            guesses, not a stopwatch.
          </p>
          <p className="muted" style={{ marginTop: 8 }}>
            Today — Day {today.day}, {today.date}: {today.label}. {today.focus}
          </p>
        </div>
        <div className="statrow" style={{ minWidth: 260 }}>
          <div>
            <b>{concepts.length || 193}</b>systems written down
          </div>
          <div>
            <b>{selectedCount || "—"}</b>chosen to build first
          </div>
          <div>
            <b>{day}/21</b>days in
          </div>
        </div>
      </div>

      {world === "ledger" && (
        <aside className="panel" aria-live="polite">
          <p className="meta">The list</p>
          <h2>What is being built</h2>
          <p>Tap a row for the idea in plain language, plus a team-vs-one-person time guess.</p>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name…" />
          {selected && (
            <article>
              <p className="meta">System {String(selected.id).padStart(3, "0")}</p>
              <h3>{selected.name}</h3>
              <p>{selected.why}</p>
              <p className="muted">
                Kind: {selected.form}. Status: {selected.status}. Team guess: {selected.estimate.team}. One
                person: {selected.estimate.soloFactory}.
              </p>
              <p className="muted">{selected.estimate.label}</p>
            </article>
          )}
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Kind</th>
                <th>Team guess</th>
                <th>One person</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 80).map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: "pointer" }}>
                  <td>{String(c.id).padStart(3, "0")}</td>
                  <td>{c.name}</td>
                  <td>{c.form}</td>
                  <td>{c.estimate?.team}</td>
                  <td>{c.estimate?.soloFactory}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted">{list.length} shown. Open Full list for every row.</p>
          <button className="ghost" style={{ marginTop: 16 }} onClick={() => setWorld("idle")}>
            Close
          </button>
        </aside>
      )}
    </div>
  );
}
