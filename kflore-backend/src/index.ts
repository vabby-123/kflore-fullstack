import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./db/client"; // ensures schema exists before routes run
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => res.json({ ok: true, service: "kflore-backend" }));

app.use("/api", productsRouter);
app.use("/api", ordersRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "internal_error" });
});

app.listen(port, () => {
  console.log(`KFLORÉ API listening on http://localhost:${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
