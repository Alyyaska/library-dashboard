import dotenv from "dotenv";
dotenv.config();

import pgPromise from "pg-promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Check server/.env");
}

const pgp = pgPromise({ capSQL: true });

export const db = pgp(process.env.DATABASE_URL);
