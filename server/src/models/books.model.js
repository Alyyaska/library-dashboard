import { db } from "../db.js";

export function listByAuthor(authorId) {
  return db.any(
    `
    SELECT
  	id,
  	author_id,
  	title,
  	pages,
  	price,
  	published_on::text AS published_on
    FROM books
    WHERE ($1::int IS NULL OR author_id = $1)
    ORDER BY id;

    `,
    [authorId]
  );
}

export function getById(id) {
  return db.oneOrNone(
    `SELECT id, author_id, title, published_on, pages, price FROM books WHERE id=$1`,
    [id]
  );
}

export function create({ author_id, title, published_on, pages, price }) {
  return db.one(
    `
    INSERT INTO books(author_id, title, published_on, pages, price)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id, author_id, title, published_on, pages, price
    `,
    [author_id, title, published_on ?? null, pages, price ?? 0]
  );
}

export function update(id, { author_id, title, published_on, pages, price }) {
  return db.oneOrNone(
    `
    UPDATE books
    SET author_id=$2, title=$3, published_on=$4, pages=$5, price=$6
    WHERE id=$1
    RETURNING id, author_id, title, published_on, pages, price
    `,
    [id, author_id, title, published_on ?? null, pages, price ?? 0]
  );
}

export function remove(id) {
  return db.result(`DELETE FROM books WHERE id=$1`, [id], r => r.rowCount > 0);
}
