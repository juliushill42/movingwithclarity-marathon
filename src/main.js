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
  const el = document.getElementById('catalog-data');
  if (el && el.textContent.trim()) {
    try {
      const packed = JSON.parse(el.textContent);
      const concepts = inflate(packed);
      if (concepts.length) return { catalog: packed, concepts };
    } catch (_) {}
  }
  const tryFetch = async (urls) => {
    for (const u of urls) {
      try {
        const r = await fetch(u);
        if (r.ok) return r.json();
      } catch (_) {}
    }
    return null;
  };
  const packed = await tryFetch([
    './public/catalog.json', '/catalog.json', './catalog.json',
    './public/concepts.json', '/concepts.json', './concepts.json',
  ]);
  let concepts = inflate(packed);
  if (concepts.length < 193) {
    const parts = await Promise.all([
      tryFetch(['./public/catalog.1.json', '/catalog.1.json', './catalog.1.json']),
      tryFetch(['./public/catalog.2.json', '/catalog.2.json', './catalog.2.json']),
    ]);
    concepts = [...inflate(parts[0]), ...inflate(parts[1])];
  }
  return { catalog: packed || { concepts }, concepts };
}
const { concepts } = await loadCatalog();

function stats() {
  const n = concepts.length;
  const selected = concepts.filter((c) => c.status === 'Selected').length;
  const company = concepts.filter((c) => c.companyCandidate).length;
  const hw = concepts.filter((c) => c.form === 'Research / Hardware').length;
  $('stats').innerHTML = [
    ['Specified', n],
    ['Selected now', selected],
    ['Company-shaped', company],
    ['Hardware/research', hw],
    ['Patents filed', '0'],
    ['Operator', '1'],
  ].map(([k, v]) => `<div><b>${v}</b>${k}</div>`).join('');
}

function openConcept(c) {
  $('hero').hidden = true;
  $('inspector').hidden = false;
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
  const v = $('tape');
  v.hidden = true;
  const url = `./public/${c.recording}`;
  const url2 = `/${c.recording}`;
  fetch(url, { method: 'HEAD' }).then((res) => {
    if (res.ok) { v.src = url; v.hidden = false; }
    else {
      return fetch(url2, { method: 'HEAD' }).then((r2) => {
        if (r2.ok) { v.src = url2; v.hidden = false; }
      });
    }
  }).catch(() => {});
}

$('close').onclick = () => {
  $('inspector').hidden = true;
  $('hero').hidden = false;
};

function renderTable(filter = '') {
  const q = filter.trim().toLowerCase();
  const rows = concepts.filter((c) => {
    if (!q) return true;
    return `${c.id} ${c.name} ${c.form} ${c.status} ${c.gate}`.toLowerCase().includes(q);
  });
  $('rows').innerHTML = rows.map((c) => `
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
    </article>`).join('') + `<p class="muted">Remaining ${Math.max(0, concepts.length - 24)} slots use the same filename rule.</p>`;
}

document.querySelectorAll('nav button').forEach((b) => {
  b.onclick = () => {
    const go = b.dataset.go;
    ['ledger', 'pose', 'ip', 'tape'].forEach((id) => { $(id).hidden = go !== id; });
    if (go === 'constellation') {
      ['ledger', 'pose', 'ip', 'tape', 'inspector'].forEach((id) => { $(id).hidden = true; });
      $('hero').hidden = false;
    }
  };
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
const geo = new THREE.SphereGeometry(0.12, 8, 8);
concepts.forEach((c, i) => {
  const hue = c.form === 'Research / Hardware' ? 0.08 : c.status === 'Selected' ? 0.5 : c.companyCandidate ? 0.55 : 0.58;
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue, 0.9, c.status === 'Selected' ? 0.7 : 0.55) });
  const m = new THREE.Mesh(geo, mat);
  const phi = Math.acos(1 - (2 * (i + 0.5)) / Math.max(concepts.length, 1));
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const r = 16 + (c.form === 'Standalone Company' ? 2 : 0);
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
  const w = innerWidth; const h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

let t = 0;
function frame() {
  t += 0.0025;
  group.rotation.y = t;
  group.rotation.x = Math.sin(t * 0.4) * 0.15;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();
