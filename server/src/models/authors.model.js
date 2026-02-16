import { db } from "../db.js";

export function count() {
  return db.one("SELECT COUNT(*)::int AS cnt FROM authors").then(r => r.cnt);
}

export function list(limit, offset) {
  return db.any(
    `
    SELECT
  	id,
  	full_name,
  	country,
  	rating,
  	birth_date::text AS birth_date
    FROM authors
    ORDER BY id
    LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
}
