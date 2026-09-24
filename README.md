# Moving With Clarity — 21-Day Marathon

Public review surface for the September 22–October 12, 2026 TitanU build run.

The site separates what is written down, what is selected to build, and what is actually finished. A selected item is not presented as completed work.

## What the site contains

- Public catalog of 193 systems.
- Day counter for the 21-day run.
- Daily schedule from September 22 through October 12, 2026.
- Searchable system ledger.
- Per-system plain-language purpose.
- System form/type.
- Status and gate fields.
- Team-vs-one-person planning estimates explicitly labeled as estimates.
- Public/protected surface metadata.
- Recording path metadata.
- Optional 3D factory scene.
- Reduced-motion, mobile, and WebGL fallbacks.

## Rendering behavior

The main experience checks:

- reduced-motion preference
- coarse-pointer/mobile conditions
- viewport width
- WebGL availability

The 3D factory scene is shown only when the browser supports WebGL and the session is not mobile/reduced-motion.

The interface overlay remains the primary information surface.

## Catalog

The client loads the catalog from:

```text
/catalog.meta.json
/rows.1.json
/rows.2.json
/rows.3.json
/rows.4.json
```

Each inflated catalog record includes:

```text
id
urn
name
why
form
status
gate
companyCandidate
team estimate
solo-factory estimate
public surface
protected field
recording path
reconstructed flag
```

URN format:

```text
urn:titanu:21d:T21-NNN
```

## Schedule

The run is fixed to:

```text
Start: Sep 22, 2026
End:   Oct 12, 2026
Length: 21 days
Timezone: America/Chicago
```

The UI exposes the current day plan while keeping planning language separate from measured completion.

## Stack

```text
Next.js 15
React 19
TypeScript
Three.js
React Three Fiber
Drei
Framer Motion
GSAP
Zustand
Tailwind CSS 4
```

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Repository layout

```text
src/app/                  Next.js routes
src/components/factory/   3D scene + interface overlay
src/lib/catalog.ts        catalog loading/inflation
src/lib/schedule.ts       21-day schedule
src/lib/store.ts          client state
src/lib/audio.ts          audio behavior
public/                   catalog/public assets
vercel.json               deployment configuration
```

## Status language

The public surface intentionally distinguishes:

```text
Selected ≠ Done
Preview URL ≠ Build Verified
Planning estimate ≠ measured build time
```

Patents: none filed.

## Ownership

Owner: Julius Cameron Hill / Titan Universal AI LLC  
Watermark: `":"`
