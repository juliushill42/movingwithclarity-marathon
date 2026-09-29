"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import catalog from "@/lib/product-catalog.json";
import "./portfolio.css";

const focus = ["T21-100", "T21-094", "T21-124", "T21-087", "T21-086", "T21-054", "T21-083", "T21-140", "T21-150", "T21-131", "T21-075", "T21-052", "T21-065", "T21-022", "T21-144"];

type Record = (typeof catalog)[number];

export default function Portfolio() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record | null>(null);
  const [onlyLinked, setOnlyLinked] = useState(false);
  const rows = useMemo(() => catalog.filter((item) => {
    const matches = `${item.id} ${item.name} ${item.does} ${item.purpose}`.toLowerCase().includes(query.trim().toLowerCase());
    return matches && (!onlyLinked || Boolean(item.repository));
  }), [query, onlyLinked]);

  return <main className="portfolio">
    <header className="portfolio-nav"><Link href="/">Moving With Clarity</Link><span>Julius Cameron Hill · Titan Universal AI LLC</span><Link href="/ledger">193 concepts →</Link></header>
    <section className="portfolio-hero">
      <p className="eyebrow">THE 21-DAY MARATHON · SEPT 22 — OCT 12, 2026</p>
      <h1>143 builds in 7 days.<br/><em>One connected vision.</em></h1>
      <p className="lead">The target was 143 builds in 21 days. Julius reports reaching that count in seven. This catalog explains 116 active build records: what each is intended to do, why it matters, and which source repositories are linked.</p>
      <div className="portfolio-metrics"><div><strong>143</strong><span>build milestone reported</span></div><div><strong>116</strong><span>active catalog records in the PDF</span></div><div><strong>23</strong><span>new private script repos confirmed</span></div><div><strong>193</strong><span>concepts in the larger plan</span></div></div>
    </section>
    <section className="vision">
      <div><p className="eyebrow">COMPANY THESIS</p><h2>Make AI useful where trust and infrastructure are limited.</h2></div>
      <div><p>These builds form a potential stack: secure agent tools and audit trails; local compute and offline inference; practical applications for people and organizations. A customer could run an agent, understand what it did, limit what it can touch, and keep essential work on hardware they control.</p><p>The billion-dollar ambition is to make that stack a dependable platform. The path runs through working demos, independent verification, deployment, customers, and repeatable revenue. The catalog records ideas and code assets; it does not establish a billion-dollar valuation.</p></div>
    </section>
    <section className="focus"><p className="eyebrow">THE CONCENTRATION</p><h2>Where the catalog sees the largest opportunity</h2><p>The PDF highlights 15 agent-security, governance, provenance, and local infrastructure assets. Their rankings and dollar figures are the author’s estimates, not appraisals or offers.</p><div className="focus-list">{focus.map(id => {const r=catalog.find(x=>x.id===id); return r && <button key={id} onClick={()=>{setSelected(r); document.getElementById("catalog")?.scrollIntoView({behavior:"smooth"});}}><span>{id}</span>{r.name}<b>↗</b></button>})}</div></section>
    <section className="catalog-section" id="catalog"><div className="catalog-heading"><div><p className="eyebrow">SOURCE: WHAT I BUILT — PRODUCT CLARITY CATALOG</p><h2>The 116 build records</h2><p>Search by name, ID, purpose, or function. Open a record for more detail, source, and estimated figures. <a href="/WHAT_I_BUILT_PRODUCT_CLARITY_CATALOG.pdf" download>Download the full source PDF ↗</a></p></div><div className="catalog-controls"><input aria-label="Search builds" placeholder="Search the catalog…" value={query} onChange={e=>setQuery(e.target.value)}/><label><input type="checkbox" checked={onlyLinked} onChange={e=>setOnlyLinked(e.target.checked)}/> Linked repositories only</label></div></div>
      <p className="result-count">{rows.length} records shown</p>
      <div className="record-grid">{rows.map(r=><button className="record" id={r.id} key={r.id} onClick={()=>setSelected(r)}><span className="record-id">{r.id}</span><h3>{r.name}</h3><p>{r.does}</p><span className="record-link">{r.repository ? `${r.repositoryAccess} repository linked` : "Catalog record"} <span>↗</span></span></button>)}</div>
    </section>
    <section className="evidence"><h2>What the figures mean</h2><p>The PDF calls its “as-is” numbers code and IP estimates for pre-revenue assets. Its “ceiling” numbers assume verified software, deployed products, and commercial traction. It says these 116 records have no revenue, users, or target-runtime proof. A repository link here establishes a source location, not a working product or a public demo.</p><p>The 23 new private marathon repositories hold original build scripts and READMEs. Other links appear only where an exact ID-to-repository match was checked.</p></section>
    <footer>© 2026 Titan Universal AI LLC · Julius Cameron Hill · <Link href="/">Marathon home</Link> · <Link href="/ledger">Full concept list</Link> · <span>":"</span></footer>
    {selected && <div className="record-backdrop" onClick={()=>setSelected(null)}><section className="record-detail" role="dialog" aria-modal="true" aria-label={selected.name} onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>Close ×</button><p className="eyebrow">{selected.id} · BUILD RECORD</p><h2>{selected.name}</h2><h3>What it is meant to do</h3><p>{selected.does}</p><h3>Why it exists</h3><p>{selected.purpose}</p>{selected.plainEnglish && <><h3>Plain English from the PDF</h3><p>{selected.plainEnglish}</p></>}{selected.howItWorks && <><h3>How the catalog says it works</h3><p>{selected.howItWorks}</p></>}{selected.audience && <><h3>Who needs it</h3><p>{selected.audience}</p></>}{selected.productType && <><h3>Product form</h3><p>{selected.productType}</p></>}<h3>Source and status</h3><p>{selected.repository ? `${selected.repositoryContents || "Repository"} · ${selected.repositoryAccess} GitHub access.` : "No repository has been verified and linked for this record."}</p>{selected.repository && <a className="repo-button" href={selected.repository} target="_blank" rel="noreferrer">Open repository ↗</a>}<div className="estimates"><div><span>As-is estimate in PDF</span><strong>{selected.asIsEstimate}</strong></div><div><span>Conditional ceiling in PDF</span><strong>{selected.conditionalCeiling}</strong></div></div><p className="small">Author estimates, not appraisal or offer. No target-runtime proof recorded in the source PDF.</p></section></div>}
  </main>;
}
