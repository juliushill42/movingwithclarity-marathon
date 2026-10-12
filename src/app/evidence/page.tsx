import Link from "next/link";
import type { CSSProperties } from "react";
import catalog from "@/lib/product-catalog.json";
import evidence from "@/lib/evidence-manifest.json";

export const metadata = {
  title: "Evidence Index — Moving With Clarity",
  description: "Source, bootstrap, verification and runtime evidence states for 116 TitanU product records. No undocumented runtime claims.",
};

type Proof = {
  id: string;
  linked_repo: string | null;
  link_access: string;
  source_inspected: boolean;
  bootstrap_path: string | null;
  verification_path: string | null;
  runtime_proven: boolean;
  source_tree?: string;
  inspection_note?: string;
};
const proofs = new Map<string, Proof>(evidence.records.map((r) => [r.id, r as Proof]));
const rows = catalog.map((build) => ({ build, proof: proofs.get(build.id) }));
const sourcesLinked = rows.filter((r) => r.proof?.linked_repo).length;
const sourceInspected = rows.filter((r) => r.proof?.source_inspected).length;
const runnableProven = rows.filter((r) => r.proof?.runtime_proven).length;
const ink: CSSProperties = { background: "#070c16", color: "#e5edf7", minHeight: "100vh", fontFamily: "Arial, system-ui, sans-serif", padding: "26px max(18px, 5vw) 76px" };
const panel: CSSProperties = { padding: "20px", border: "1px solid #263345", borderRadius: "14px", background: "#0e1725" };
const subtle: CSSProperties = { color: "#9db0c8", lineHeight: 1.6, fontSize: "14px" };
const link: CSSProperties = { color: "#79dcd6", textDecoration: "underline", textUnderlineOffset: "3px" };
const th: CSSProperties = { textAlign: "left", padding: "13px 12px", color: "#b0c0d6", fontSize: "12px", whiteSpace: "nowrap" };
const td: CSSProperties = { padding: "14px 12px", borderTop: "1px solid #283445", verticalAlign: "top", fontSize: "13px", lineHeight: 1.55 };

function label(p?: Proof) {
  if (!p?.linked_repo) return "No source link";
  if (!p.source_inspected) return "Linked; not inspected";
  if (p.inspection_note?.includes("not reproducible")) return "Launcher incomplete";
  return "Source inspected";
}

export default function EvidencePage() {
  return (
    <main style={ink}>
      <header style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", justifyContent: "space-between", marginBottom: "36px" }}>
        <Link href="/" style={{ ...link, textDecoration: "none", fontWeight: 800, letterSpacing: "0.08em" }}>MOVING WITH CLARITY :</Link>
        <nav aria-label="Site navigation" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/portfolio" style={link}>Explore the builds</Link>
          <Link href="/marathon" style={link}>Marathon</Link>
          <a href="https://jujulabz.com" style={link}>JujuLabz / RHEA ↗</a>
        </nav>
      </header>

      <section style={{ maxWidth: "900px", marginBottom: "32px" }}>
        <p style={{ ...subtle, letterSpacing: "0.14em", color: "#79dcd6" }}>SOURCE → BUILD → TEST → RUNTIME</p>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 62px)", lineHeight: 1.07, margin: "12px 0" }}>Evidence index.</h1>
        <p style={{ ...subtle, fontSize: "16px" }}>
          Each catalog claim is paired with the source link on record, any inspected build launcher,
          any recorded verification document, and confirmed runtime evidence. These are separate facts:
          a repository link does not mean the product was compiled; a test document does not mean the product is deployed.
        </p>
      </section>

      <section aria-label="Evidence totals" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: "12px", marginBottom: "24px" }}>
        {[
          ["Catalog entries", rows.length],
          ["Source links", sourcesLinked],
          ["Source inspected", sourceInspected],
          ["Runtime proven here", runnableProven],
        ].map(([title, value]) => (
          <div key={title} style={panel}><div style={{ fontSize: "32px", fontWeight: 750 }}>{value}</div><div style={subtle}>{title}</div></div>
        ))}
      </section>

      <section style={{ ...panel, marginBottom: "24px" }}>
        <p style={{ letterSpacing: "0.14em", fontSize: "12px", color: "#79dcd6" }}>HARNESS / RHEA</p>
        <h2 style={{ margin: "8px 0 12px", fontSize: "23px" }}>RHEA’s designated home: JujuLabz</h2>
        <p style={subtle}>
          <a href="https://jujulabz.com" style={link}>jujulabz.com</a>
          {" · "}
          <a href="https://github.com/juliushill42/rheasytemtar2-26" style={link}>Published RHEA system source</a>
        </p>
        <p style={subtle}>
          Domain ownership and Vercel configuration were checked. The domain currently maps to a Vercel project called
          "voice-and-vision"; that mapping does not establish that RHEA’s five services and dashboard are running at the domain.
          RHEA runtime status: not verified.
        </p>
      </section>

      <section style={{ ...panel, padding: "10px", overflowX: "auto" }} aria-label="Product evidence">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "880px" }}>
          <thead><tr>
            <th style={th}>Catalog record</th>
            <th style={th}>Source</th>
            <th style={th}>Bootstrap</th>
            <th style={th}>Verification artifact</th>
            <th style={th}>Runtime</th>
          </tr></thead>
          <tbody>{rows.map(({ build, proof }) => (
            <tr key={build.id} id={build.id}>
              <td style={td}><Link href={"/portfolio#" + build.id} style={link}>{build.id}</Link><div style={{ fontWeight: 700, marginTop: "3px" }}>{build.name}</div><div style={subtle}>{build.does}</div></td>
              <td style={td}>
                <strong>{label(proof)}</strong>
                <div style={subtle}>
                  {!proof?.linked_repo ? "No repository mapped in the catalog." :
                   proof.link_access === "public" && proof.source_inspected ?
                   <a href={proof.linked_repo} style={link}>Public source ↗</a> :
                   "Source access by review; no public source access implied."}
                </div>
              </td>
              <td style={td}>{proof?.bootstrap_path ? <><code>{proof.bootstrap_path}</code><p style={subtle}>Launcher file exists; execution not certified.</p></> : "Not inspected / not recorded"}</td>
              <td style={td}>{proof?.verification_path ? <><code>{proof.verification_path}</code><p style={subtle}>Report exists; result not independently established.</p></> : "Not recorded"}{proof?.inspection_note && <p style={{ ...subtle, color: "#ffd19a" }}>{proof.inspection_note}</p>}</td>
              <td style={td}>{proof?.runtime_proven ? "Verified with evidence" : "Not verified"}</td>
            </tr>
          ))}</tbody>
        </table>
      </section>
      <footer style={{ ...subtle, marginTop: "26px" }}>
        Source inventory date: {evidence.as_of}. Author estimates are not appraisals. This page discloses evidence status; it does not publish private implementation files. © 2026 Titan Universal AI LLC · ":"
      </footer>
    </main>
  );
}
