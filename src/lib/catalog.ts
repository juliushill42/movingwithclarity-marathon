export type Concept = {
  id: number; urn: string; name: string; why: string; form: string; status: string; gate: string;
  companyCandidate: boolean;
  estimate: { team: string; soloFactory: string; unit: string; label: string };
  publicSurface: string; protected: string; recording: string; reconstructed: boolean;
};
type Packed = {
  forms: string[]; statuses: string[]; gates: string[]; units: string[];
  defaults?: { label?: string; publicSurface?: string; protected?: string };
  rows: Array<[number, string, string, number, number, number, number, string, string, number, number]>;
};
export function inflate(meta: Packed): Concept[] {
  const d = meta.defaults || {};
  return (meta.rows || []).map((r) => {
    const id = r[0]; const pad = String(id).padStart(3, "0");
    return {
      id, urn: `urn:titanu:21d:T21-${pad}`, name: r[1], why: r[2],
      form: meta.forms[r[3]], status: meta.statuses[r[4]], gate: meta.gates[r[5]],
      companyCandidate: !!r[6],
      estimate: { team: r[7], soloFactory: r[8], unit: meta.units[r[9]], label: d.label || "planning estimate — not measured hours" },
      publicSurface: d.publicSurface || "", protected: d.protected || "",
      recording: `recordings/T21-${pad}.webm`, reconstructed: !!r[10],
    };
  });
}
export async function loadCatalog(): Promise<Concept[]> {
  const [meta, r1, r2, r3, r4] = await Promise.all([
    fetch("/catalog.meta.json").then((r) => r.json()),
    fetch("/rows.1.json").then((r) => r.json()),
    fetch("/rows.2.json").then((r) => r.json()),
    fetch("/rows.3.json").then((r) => r.json()),
    fetch("/rows.4.json").then((r) => r.json()),
  ]);
  return inflate({ ...meta, rows: [...r1, ...r2, ...r3, ...r4] });
}
export function dayOfRun() {
  const start = Date.parse("2026-09-22T00:00:00-05:00");
  return Math.min(21, Math.max(1, Math.floor((Date.now() - start) / 86400000) + 1));
}
