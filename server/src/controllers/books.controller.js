import * as Books from "../models/books.model.js";

const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};

export async function list(req, res) {
  const authorId = toInt(req.query.authorId, null);
  if (!authorId) return res.status(400).json({ error: "Нужен authorId" });

  const rows = await Books.listByAuthor(authorId);
  res.json({ rows });
}

export async function getById(req, res) {
  const id = toInt(req.params.id, -1);
  const row = await Books.getById(id);
  if (!row) return res.status(404).json({ error: "Book not found" });
  res.json(row);
}

export async function create(req, res) {
  const { author_id, title, published_on, pages, price } = req.body || {};
  if (!author_id || !title || !pages) {
    return res.status(400).json({ error: "author_id, title, pages are required" });
  }

  const row = await Books.create({ author_id, title, published_on, pages, price });
  res.status(201).json(row);
}

export async function update(req, res) {
  const id = toInt(req.params.id, -1);
  const { author_id, title, published_on, pages, price } = req.body || {};
  if (!author_id || !title || !pages) {
    return res.status(400).json({ error: "author_id, title, pages are required" });
  }

  const row = await Books.update(id, { author_id, title, published_on, pages, price });
  if (!row) return res.status(404).json({ error: "Book not found" });
  res.json(row);
}

export async function remove(req, res) {
  const id = toInt(req.params.id, -1);
  const ok = await Books.remove(id);
  if (!ok) return res.status(404).json({ error: "Book not found" });
  res.status(204).send();
}
