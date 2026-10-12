import { createHash } from "node:crypto";
import catalog from "@/lib/product-catalog.json";
import evidence from "@/lib/evidence-manifest.json";

export const dynamic = "force-static";

const source = new Map(evidence.records.map((p) => [p.id, p]));
const records = catalog.map((item) => {
  const p = source.get(item.id);
  return {
    id: item.id,
    name: item.name,
    catalog_url: "/portfolio#" + item.id,
    repository_slug: p?.linked_repo?.split("/").pop() || null,
    repository_visibility: p?.link_access ?? "unlinked",
    tree_sha: "source_tree" in (p || {}) ? (p as { source_tree?: string }).source_tree || null : null,
    bootstrap_file: p?.bootstrap_path || null,
    verification_file: p?.verification_path || null,
    runtime_proven: p?.runtime_proven === true,
  };
});

const data = {
  schema: "titanu.clarity.evidence/1",
  as_of: evidence.as_of,
  meaning: "Source-tree inventory only. Runtime proof requires reproducible tests and an execution artifact.",
  harness: {
    name: "RHEA",
    home: evidence.harness.public_home,
    runtime_proven: evidence.harness.runtime_proven,
  },
  counts: {
    total: records.length,
    linked: records.filter((x) => x.repository_slug).length,
    source_trees_checked: records.filter((x) => x.tree_sha).length,
    bootstrap_files: records.filter((x) => x.bootstrap_file).length,
    verification_files: records.filter((x) => x.verification_file).length,
    runtime_proven: records.filter((x) => x.runtime_proven).length,
  },
  records,
};
const body = JSON.stringify(data);
const etag = '"' + createHash("sha256").update(body).digest("hex") + '"';
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=300, must-revalidate",
  "X-Content-Type-Options": "nosniff",
  ETag: etag,
};
export function GET(request: Request): Response {
  if (request.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers });
  return new Response(body, { status: 200, headers });
}
