import { Router } from "express";
import { db } from "../db/client";

export const productsRouter = Router();

function rowToProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    compareAt: row.compare_at,
    size: row.size,
    description: row.description,
    details: JSON.parse(row.details),
    palette: JSON.parse(row.palette),
    variant: row.variant,
    bestseller: !!row.bestseller,
    isNew: !!row.is_new,
  };
}

productsRouter.get("/categories", (_req, res) => {
  const rows = db.prepare("SELECT * FROM categories").all();
  res.json(rows);
});

productsRouter.get("/products", (req, res) => {
  const { category } = req.query;
  const rows = category
    ? db.prepare("SELECT * FROM products WHERE active = 1 AND category = ? ORDER BY rowid").all(String(category))
    : db.prepare("SELECT * FROM products WHERE active = 1 ORDER BY rowid").all();
  res.json(rows.map(rowToProduct));
});

productsRouter.get("/products/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM products WHERE id = ? AND active = 1").get(req.params.id);
  if (!row) return res.status(404).json({ error: "not_found", message: "No product with that id." });
  res.json(rowToProduct(row));
});
