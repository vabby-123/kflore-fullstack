import type { NextFunction, Request, Response } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || expected === "change-me-to-a-long-random-string") {
    return res.status(500).json({
      error: "server_misconfigured",
      message: "Set ADMIN_API_KEY in your .env before using admin routes.",
    });
  }

  const header = req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token !== expected) {
    return res.status(401).json({ error: "unauthorized", message: "Missing or invalid admin API key." });
  }

  next();
}
