import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync(new URL("../src/lib/product-catalog.json", import.meta.url), "utf8"));
const manifest = JSON.parse(readFileSync(new URL("../src/lib/evidence-manifest.json", import.meta.url), "utf8"));
const records = manifest.records;
const catalogIds = catalog.map((r) => r.id);
const evidenceIds = records.map((r) => r.id);

test("every public product claim has exactly one evidence record", () => {
  assert.equal(records.length, catalog.length);
  assert.equal(new Set(evidenceIds).size, evidenceIds.length);
  assert.deepEqual(evidenceIds, catalogIds);
});

test("source links are not silently transformed into verified runtime", () => {
  for (const item of records) {
    const source = catalog.find((r) => r.id === item.id);
    assert.equal(item.linked_repo, source.repository);
    assert.ok(item.runtime_proven === false || item.runtime_proven === true);
    if (item.runtime_proven) {
      assert.ok(item.source_inspected, "Cannot claim runtime proof without inspected source: " + item.id);
      assert.ok(item.runtime_evidence_url, "Runtime proof requires a retrievable evidence URL: " + item.id);
      assert.ok(item.runtime_evidence_sha, "Runtime proof requires artifact integrity: " + item.id);
    }
    if (item.source_inspected) {
      assert.ok(item.source_tree, "Inspected source must have an exact Git tree SHA: " + item.id);
      assert.ok(["public", "private", "internal"].includes(item.link_access));
    }
    if (item.bootstrap_path) assert.ok(item.source_inspected);
    if (item.verification_path) assert.ok(item.source_inspected);
  }
});

test("private source access is never inferred to be public", () => {
  for (const item of records) {
    if (!item.source_inspected) assert.notEqual(item.link_access, "public");
  }
});

test("RHEA attribution links only to the known domain and published source", () => {
  assert.equal(new URL(manifest.harness.public_home).hostname, "jujulabz.com");
  assert.equal(manifest.harness.source, "https://github.com/juliushill42/rheasytemtar2-26");
  assert.equal(manifest.harness.runtime_proven, false);
});

test("portfolio evidence links and page exist", () => {
  const page = readFileSync(new URL("../src/app/portfolio/page.tsx", import.meta.url), "utf8");
  const evidencePage = readFileSync(new URL("../src/app/evidence/page.tsx", import.meta.url), "utf8");
  assert.match(page, /\/evidence#/);
  assert.match(page, /jujulabz\.com/);
  assert.match(evidencePage, /catalog\.map/);
});
