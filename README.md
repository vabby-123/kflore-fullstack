# KFLORÉ — Full-Stack E-Commerce

Built from the KFLORÉ mood board (burgundy/gold/ivory palette, 8 collections, WhatsApp ordering). Two independent projects:

- **`kflore-store/`** — the storefront. React 18 + TypeScript + Vite + Tailwind/shadcn, with a three.js generative 3D hero. This is also published as a single-file Claude Artifact for an instant, interactive preview — this folder is the real editable source behind it.
- **`kflore-backend/`** — the API. Express + TypeScript + SQLite: product catalog, categories, and order intake with server-side pricing, an admin order inbox, and an optional push to your business WhatsApp via the official Cloud API.

Each has its own README with setup steps. Quick start:

```bash
# Terminal 1 — API
cd kflore-backend
npm install
cp .env.example .env   # set ADMIN_API_KEY and STORE_WHATSAPP_NUMBER
npm run seed
npm run dev              # http://localhost:4000

# Terminal 2 — storefront
cd kflore-store
pnpm install
pnpm dev                  # http://localhost:5173
```

As shipped, the storefront's catalog is a static file and checkout goes straight to WhatsApp — that's what the brand brief itself asked for, and it works with zero backend at all. The backend is there for when you want a real product database, order history, and an admin inbox instead of relying on the customer's WhatsApp thread; `kflore-backend/README.md` has the three-step wiring guide.

## Why two checkout paths exist

The mood board's own notes specify "Order via WhatsApp" as the primary checkout button, so the storefront builds that flow client-side and needs nothing else to work. The backend's `POST /api/orders` does the same job server-side — it looks up real prices, stores the order, and returns the same kind of `wa.me` link — so you can adopt it later without changing the ordering experience customers see.
