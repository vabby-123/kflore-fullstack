# KFLORÉ — Storefront

A premium floral e-commerce frontend for KFLORÉ (Kuala Lumpur & Selangor), built from the brand's mood board: deep burgundy / champagne gold / warm ivory palette, eight product collections, and WhatsApp-based checkout.

**Stack:** React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, [three.js](https://threejs.org) for the generative 3D hero bloom.

A pre-built, single-file version of this app is also published as a Claude Artifact for an instant preview; this folder is the actual editable source.

## Run it

```bash
pnpm install   # or npm install / yarn
pnpm dev        # http://localhost:5173
```

```bash
pnpm build       # type-checks and builds to dist/
pnpm preview      # serve the production build locally
```

## What's here

- **Hero** (`src/components/Hero3D.tsx`) — a WebGL scene built from primitives (no external 3D model): layered petal meshes, soft point lights tuned to the brand palette, ambient particle motes, and gentle parallax on pointer move. Respects `prefers-reduced-motion`.
- **Generative product art** (`src/components/PetalMotif.tsx`) — every product card's "photo" is a procedurally laid-out cluster of gradient-shaded petals colored from that product's own palette, rather than stock photography. Six layout variants (`variant: 0-5`) plus each product's 3-color palette give a large, varied catalog from one small component.
- **Catalog** (`src/data/products.ts`) — the 8 collections and 17 starter products from the brand brief (Hand Bouquets, Flower Boxes, Graduation, Birthday, Anniversary, Sympathy, Wedding, Grand Opening). Swap this for a `fetch` to `../kflore-backend`'s `/api/products` to go live — see that project's README.
- **Cart & checkout** (`src/context/CartContext.tsx`, `src/components/CartDrawer.tsx`) — client-side cart persisted to `localStorage`, a delivery-details form, and a WhatsApp hand-off (`src/lib/whatsapp.ts`) that formats the order and opens a pre-filled `wa.me` link — matching the brief's own "Order via WhatsApp" flow. Update `STORE_WHATSAPP` in that file to your real business number before launch.
- Light and dark themes are both fully styled (`src/index.css`) — the palette swaps but stays on-brand in both.

## Rebuilding the single-file artifact

`build_artifact.sh` runs the Parcel + html-inline pipeline used to produce the standalone `artifact.html` (fonts stay as external Google Fonts links; everything else — JS, CSS, the three.js scene — is inlined into one file).

```bash
bash build_artifact.sh
```
