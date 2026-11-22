import { Router } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { db } from "../db/client";
import { adminAuth } from "../middleware/adminAuth";
import { buildCustomerWhatsAppLink, notifyStoreViaWhatsApp } from "../lib/whatsapp";
import type { OrderRecord, OrderStatus } from "../types";

export const ordersRouter = Router();

const orderInputSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1).max(50),
        note: z.string().max(280).optional(),
      })
    )
    .min(1, "Add at least one item."),
  fullName: z.string().min(1).max(120),
  phone: z.string().min(6).max(30),
  address: z.string().min(5).max(500),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  cardMessage: z.string().max(500).optional(),
  recipientDifferent: z.boolean().optional(),
  recipientName: z.string().max(120).optional(),
  recipientPhone: z.string().max(30).optional(),
});

function loadOrder(id: string): OrderRecord | null {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as any;
  if (!order) return null;
  const items = db.prepare("SELECT product_id as productId, name, price, qty, note FROM order_items WHERE order_id = ?").all(id) as any[];
  return {
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    fullName: order.full_name,
    phone: order.phone,
    address: order.address,
    date: order.date,
    timeSlot: order.time_slot,
    cardMessage: order.card_message,
    recipientDifferent: !!order.recipient_different,
    recipientName: order.recipient_name,
    recipientPhone: order.recipient_phone,
    subtotal: order.subtotal,
    items,
  };
}

// POST /api/orders — place an order. Prices are looked up server-side from
// the product catalog so a tampered client request can't under-charge.
ordersRouter.post("/orders", async (req, res) => {
  const parsed = orderInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid_input", issues: parsed.error.issues });
  }
  const input = parsed.data;

  const productStmt = db.prepare("SELECT id, name, price FROM products WHERE id = ? AND active = 1");
  const resolvedItems: { productId: string; name: string; price: number; qty: number; note?: string }[] = [];

  for (const item of input.items) {
    const product = productStmt.get(item.productId) as { id: string; name: string; price: number } | undefined;
    if (!product) {
      return res.status(400).json({ error: "unknown_product", message: `No active product with id ${item.productId}` });
    }
    resolvedItems.push({ productId: product.id, name: product.name, price: product.price, qty: item.qty, note: item.note });
  }

  const subtotal = resolvedItems.reduce((sum, l) => sum + l.price * l.qty, 0);
  const id = `KF-${nanoid(8).toUpperCase()}`;

  const insertOrder = db.prepare(
    `INSERT INTO orders (id, full_name, phone, address, date, time_slot, card_message, recipient_different, recipient_name, recipient_phone, subtotal)
     VALUES (@id, @fullName, @phone, @address, @date, @timeSlot, @cardMessage, @recipientDifferent, @recipientName, @recipientPhone, @subtotal)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, name, price, qty, note) VALUES (@orderId, @productId, @name, @price, @qty, @note)`
  );

  const run = db.transaction(() => {
    insertOrder.run({
      id,
      fullName: input.fullName,
      phone: input.phone,
      address: input.address,
      date: input.date,
      timeSlot: input.timeSlot,
      cardMessage: input.cardMessage ?? null,
      recipientDifferent: input.recipientDifferent ? 1 : 0,
      recipientName: input.recipientName ?? null,
      recipientPhone: input.recipientPhone ?? null,
      subtotal,
    });
    for (const item of resolvedItems) {
      insertItem.run({ orderId: id, productId: item.productId, name: item.name, price: item.price, qty: item.qty, note: item.note ?? null });
    }
  });
  run();

  const order = loadOrder(id)!;
  const storeNumber = process.env.STORE_WHATSAPP_NUMBER || "60123456789";
  const whatsappLink = buildCustomerWhatsAppLink(order, storeNumber);
  const notify = await notifyStoreViaWhatsApp(order);

  res.status(201).json({ order, whatsappLink, storeNotified: notify.sent });
});

// GET /api/orders/:id — order status lookup for a customer (no auth: id is
// an unguessable nanoid, but this is intentionally read-only and minimal).
ordersRouter.get("/orders/:id", (req, res) => {
  const order = loadOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "not_found" });
  res.json(order);
});

// ---- Admin (staff) routes: list and manage incoming orders ----

ordersRouter.get("/admin/orders", adminAuth, (req, res) => {
  const status = req.query.status as OrderStatus | undefined;
  const rows = status
    ? db.prepare("SELECT id FROM orders WHERE status = ? ORDER BY created_at DESC").all(status)
    : db.prepare("SELECT id FROM orders ORDER BY created_at DESC").all();
  const orders = (rows as { id: string }[]).map((r) => loadOrder(r.id));
  res.json(orders);
});

ordersRouter.get("/admin/orders/:id", adminAuth, (req, res) => {
  const order = loadOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "not_found" });
  res.json(order);
});

const statusSchema = z.object({
  status: z.enum(["new", "confirmed", "out_for_delivery", "delivered", "cancelled"]),
});

ordersRouter.patch("/admin/orders/:id/status", adminAuth, (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input", issues: parsed.error.issues });

  const result = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(parsed.data.status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "not_found" });

  res.json(loadOrder(req.params.id));
});
