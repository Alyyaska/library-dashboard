import * as Authors from "../models/authors.model.js";

export async function list(req, res) {
  const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
  const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

  const [rows, total] = await Promise.all([
    Authors.list(limit, offset),
    Authors.count()
  ]);

  res.json({ rows, total, limit, offset });
}
