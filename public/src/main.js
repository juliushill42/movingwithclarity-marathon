import * as THREE from 'three';

const $ = (id) => document.getElementById(id);

function inflate(raw) {
  if (!raw) return [];
  if (Array.isArray(raw.concepts)) return raw.concepts;
  if (Array.isArray(raw)) return raw;
  if (!Array.isArray(raw.rows)) return [];
  const d = raw.defaults || {};
  return raw.rows.map((r) => {
    const id = r[0];
    const pad = String(id).padStart(3, '0');
    return {
      id,
      urn: `urn:titanu:21d:T21-${pad}`,
      name: r[1],
      why: r[2],
      form: raw.forms[r[3]],
      status: raw.statuses[r[4]],
      gate: raw.gates[r[5]],
      companyCandidate: !!r[6],
      estimate: { team: r[7], soloFactory: r[8], unit: raw.units[r[9]], label: d.label },
      publicSurface: d.publicSurface,
      protected: d.protected,
      recording: `recordings/T21-${pad}.webm`,
      reconstructed: !!r[10],
    };
  });
}

async function loadCatalog() {
  const tryFetch = async (urls) => {
    for (const u of urls) {
      try {
        const r = await fetch(u);
        if (r.ok) return r.json();
      } catch (_) {}
    }
    return null;
  };
  const meta = await tryFetch(['/catalog.meta.json', './catalog.meta.json']);
  const parts = await Promise.all([1, 2, 3, 4].map((i) =>
    tryFetch([`/rows.${i}.json`, `./rows.${i}.json`])
  ));
  const rows = parts.flatMap((p) => (Array.isArray(p) ? p : []));
  return (meta && rows.length) ? inflate({ ...meta, rows }) : [];
}

const concepts = await loadCatalog();

const start = Date.parse('2026-09-22T00:00:00-05:00');
const day = Math.min(21, Math.max(1, Math.floor((Date.now() - start) / 86400000) + 1));
if ($('dayn')) $('dayn').textContent = String(day);

function stats() {
  const n = concepts.length;
  $('stats').innerHTML = [
    ['Specified', n],
    ['Selected', concepts.filter((c) => c.status === 'Selected').length],
    ['Company-shaped', concepts.filter((c) => c.companyCandidate).length],
    ['Hardware/research', concepts.filter((c) => c.form === 'Research / Hardware').length],
    ['Patents filed', '0'],
    ['Operators', '1'],
    ['Day', `${day}/21`],
    ['Tapes on disk', 'drop-in'],
  ].map(([k, v]) => `<div><b>${v}</b>${k}</div>`).join('');
}

function show(id) {
  ['home', 'inspector', 'ledger', 'pose', 'kill', 'ip', 'tape'].forEach((k) => {
    const el = $(k);
    if (el) el.hidden = k !== id;
  });
  document.querySelectorAll('nav button').forEach((b) => {
    const key = id === 'inspector' ? 'home' : id;
    b.classList.toggle('on', b.dataset.go === key);
  });
}

function openConcept(c) {
  show('inspector');
  $('home').hidden = true;
  $('urn').textContent = c.urn;
  $('iname').textContent = `T21-${String(c.id).padStart(3, '0')} · ${c.name}`;
  $('iwhy').textContent = c.why;
  $('iwhy2').textContent = c.why;
  $('iform').textContent = c.form + (c.reconstructed ? ' · reconstructed ledger completion' : '');
  $('istatus').innerHTML = `<span class="pill status-${c.status}">${c.status}</span><span class="pill">${c.companyCandidate ? 'company candidate' : 'component/product'}</span>`;
  $('iteam').textContent = `${c.estimate.team} for a conventional 3–5 person squad to reach a ${c.estimate.unit}. ${c.estimate.label}.`;
  $('isolo').textContent = `${c.estimate.soloFactory} for a specified factory drop (shell + tests + hashes), not a staffed company. ${c.estimate.label}.`;
  $('ipub').textContent = c.publicSurface;
  $('ipriv').textContent = c.protected;
  $('igate').textContent = `${c.gate} · drafts unfiled · do not say patented`;
  $('tpath').textContent = c.recording;
  const v = $('tapev');
  v.hidden = true;
  fetch('/' + c.recording, { method: 'HEAD' }).then((res) => {
    if (res.ok) { v.src = '/' + c.recording; v.hidden = false; }
  }).catch(() => {});
}

$('close').onclick = () => show('home');

function renderTable(filter = '') {
  const q = filter.trim().toLowerCase();
  const list = concepts.filter((c) => !q || `${c.id} ${c.name} ${c.form} ${c.status} ${c.gate}`.toLowerCase().includes(q));
  $('rows').innerHTML = list.map((c) => `
    <tr data-id="${c.id}">
      <td>T21-${String(c.id).padStart(3,'0')}</td>
      <td>${c.name}</td>
      <td>${c.form}</td>
      <td class="status-${c.status}">${c.status}</td>
      <td class="gate-${c.gate}">${c.gate}</td>
      <td>${c.estimate.team}</td>
      <td>${c.estimate.soloFactory}</td>
    </tr>`).join('');
  $('rows').onclick = (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const c = concepts.find((x) => x.id === Number(tr.dataset.id));
    if (c) openConcept(c);
  };
}

$('q')?.addEventListener('input', (e) => renderTable(e.target.value));

function renderTapes() {
  $('tapes').innerHTML = concepts.slice(0, 24).map((c) => `
    <article>
      <div>T21-${String(c.id).padStart(3,'0')}</div>
      <strong>${c.name}</strong>
      <p class="muted">${c.recording}</p>
    </article>`).join('') + `<p class="muted">Remaining ${Math.max(0, concepts.length - 24)} slots use the same filename rule. No file = empty slot.</p>`;
}

document.querySelectorAll('nav button').forEach((b) => {
  b.onclick = () => show(b.dataset.go);
});

stats();
renderTable();
renderTapes();

const canvas = $('void');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
camera.position.set(0, 0, 46);
const group = new THREE.Group();
scene.add(group);
const geo = new THREE.SphereGeometry(0.14, 10, 10);
concepts.forEach((c, i) => {
  const hue = c.form === 'Research / Hardware' ? 0.08 : c.status === 'Selected' ? 0.5 : c.companyCandidate ? 0.55 : 0.58;
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue, 0.95, c.status === 'Selected' ? 0.72 : 0.52) });
  const m = new THREE.Mesh(geo, mat);
  const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(concepts.length, 1));
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const r = 16 + (c.form === 'Standalone Company' ? 2.2 : 0);
  m.position.setFromSphericalCoords(r, phi, theta);
  m.userData = c;
  group.add(m);
});
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();
canvas.addEventListener('pointerdown', (ev) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  ray.setFromCamera(mouse, camera);
  const hit = ray.intersectObjects(group.children)[0];
  if (hit) openConcept(hit.object.userData);
});
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();
let t = 0;
(function frame() {
  t += 0.0024;
  group.rotation.y = t;
  group.rotation.x = Math.sin(t * 0.4) * 0.16;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
})();
