# KFLORÉ — Backend API

A small Express + TypeScript API for the KFLORÉ storefront: product catalog, categories, and order intake with server-computed pricing. Data is stored in SQLite (via `better-sqlite3`) — no external database to provision.

## Setup

```bash
npm install
cp .env.example .env      # then edit ADMIN_API_KEY and STORE_WHATSAPP_NUMBER
npm run seed               # creates data/kflore.db and loads the catalog
npm run dev                 # http://localhost:4000, restarts on change
```

For production:

```bash
npm run build
npm start
```

## Endpoints

| Method | Path                          | Auth  | Description |
|--------|-------------------------------|-------|-------------|
| GET    | `/health`                     | —     | Liveness check |
| GET    | `/api/categories`              | —     | All 8 collections |
| GET    | `/api/products`                | —     | All active products (`?category=wedding` to filter) |
| GET    | `/api/products/:id`             | —     | One product |
| POST   | `/api/orders`                    | —     | Place an order (see body below) |
| GET    | `/api/orders/:id`                 | —     | Look up one order by its id |
| GET    | `/api/admin/orders`                | Bearer | List orders, newest first (`?status=new`) |
| GET    | `/api/admin/orders/:id`             | Bearer | One order |
| PATCH  | `/api/admin/orders/:id/status`       | Bearer | Body: `{ "status": "confirmed" }` |

Admin routes expect `Authorization: Bearer <ADMIN_API_KEY>`.

### Placing an order

```http
POST /api/orders
Content-Type: application/json

{
  "items": [{ "productId": "an-01", "qty": 1 }],
  "fullName": "Aisyah Rahman",
  "phone": "012-345 6789",
  "address": "23 Jalan Telawi, Bangsar, 59100 Kuala Lumpur",
  "date": "2026-09-05",
  "timeSlot": "12pm – 3pm",
  "cardMessage": "Happy anniversary, my love."
}
```

Prices are always re-looked-up from the `products` table on the server — the client only ever sends a `productId` and `qty`, so a tampered request can't change what's charged. The response includes a ready-to-open `whatsappLink` (a `wa.me` deep link pre-filled with the order) — this is the same mechanism the bundled frontend uses client-side, so the two stay consistent whether or not this API is wired up yet.

### Notifying your WhatsApp automatically (optional)

If you fill in `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_NOTIFY_TO` in `.env` (from a WhatsApp Cloud API app on [developers.facebook.com](https://developers.facebook.com)), every new order also gets pushed straight to your business WhatsApp via the official API — no customer tap required. Leave them blank and the storefront's own "Order via WhatsApp" button still works.

## Project layout

```
src/
  db/
    client.ts     — SQLite connection + schema (auto-creates tables on boot)
    seed.ts        — loads the same 17-product catalog the frontend ships with
  lib/
    whatsapp.ts     — order message formatting + wa.me link + optional Cloud API push
  middleware/
    adminAuth.ts     — bearer-token guard for /api/admin/*
  routes/
    products.ts       — categories + products
    orders.ts           — order intake + admin order management
  types.ts
  index.ts              — Express app wiring
```

## Connecting the frontend

The bundled storefront (`../kflore-store`) currently talks to no backend at all — its catalog is a static TypeScript file and checkout hands off to WhatsApp directly, matching the original brief. To wire it to this API instead:

1. Deploy this service (Render, Railway, Fly.io, a small VPS — anything that runs Node) and note its URL.
2. In the frontend, replace the static import from `src/data/products.ts` with a `fetch('${API_URL}/api/products')` call (e.g. in a small `useEffect` + `useState`, or a data-fetching library if you add one).
3. On checkout, `POST` the cart to `${API_URL}/api/orders` instead of building the WhatsApp link purely client-side — use the `whatsappLink` the API returns so pricing always reflects the server's numbers.
4. Set `CORS_ORIGIN` in this API's `.env` to your deployed frontend's origin.

## Deploying

Any Node 18+ host works. The SQLite file at `DATABASE_PATH` needs to sit on persistent disk (Railway, Fly.io volumes, or a small VPS all support this — most serverless/edge platforms do not, since their filesystem is ephemeral). For a fully managed database instead of file-based SQLite, swap `better-sqlite3` for `pg` + a hosted Postgres and adjust `src/db/client.ts` and the two route files — the schema is intentionally simple (4 tables) to make that swap straightforward.
